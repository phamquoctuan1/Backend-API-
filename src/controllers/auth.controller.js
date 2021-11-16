const db = require('../models');
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const { uploadFile } = require('../utils/upload');
const jwt = require('jsonwebtoken');
const { jwtCustom } = require('../utils/jwtCustom');
const bcrypt = require('bcryptjs');
const e = require('express');
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/sendmail');
const { restart } = require('nodemon');
const randomstring = require('randomstring');

exports.getUser = async (req, res) => {
  res.status(200).json(req.userInfo);
};
exports.Register = async (req, res) => {
  const t = await db.sequelize.transaction();
  // Save User to Database
  try {
    const { picture } = req.body;
    let pictureName;
    if (picture) {
      pictureName = await uploadFile(picture);
    }
    const user = await User.create(
      {
        name: req.body.name,
        userName: req.body.userName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        phone: req.body.phone,
        address: req.body.address,
        picture: pictureName,
      },
      { transaction: t }
    );
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
      console.log(roles);
      user.setRoles(roles);
    } else {
      user.setRoles([1]);
    }
    const token = jwtCustom.sign(
      { id: user.id, name: user.name },
      process.env.ACCESS_TOKEN_SECRET,
      '30m'
    );

    let subject = 'Kích hoạt tài khoản của bạn';
    let text = `Hi ${user.name} Chào mừng bạn đến với shop của chúng tôi`;
    let html = `
    <h3>Hi ${user.name} Bạn đã đăng ký tài khoản của chúng tôi xin hãy xác nhận kích hoạt tài khoản bằng cách<h3/>
    Bấm vào link <a href=http://127.0.0.1:3000/verify/account/${user.id}/${token}>này</a> để kích hoạt tài khoản của bạn`;
    await sendEmail(user.email, subject, text, html);
    await t.commit();
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};
exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = await jwtCustom.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const { id } = decoded;

    const user = await User.findByPk(id);

    if (user.isEnabled) {
      return res.status(400).json({ message: 'Tài khoản đã được kích hoạt' });
    } else {
      user.isEnabled = 1;
      user.save();
      return res
        .status(200)
        .json({ message: 'kích hoạt tài khoản thành công thành công' });
    }
  } catch (error) {
    const { id } = req.params;
    const user = await User.findByPk(id);
    const token = jwtCustom.sign(
      { id: id },
      process.env.ACCESS_TOKEN_SECRET,
      '30m'
    );

    let subject = 'Kích hoạt tài khoản của bạn';
    let text = `Hi ${user.name} Chào mừng bạn đến với shop của chúng tôi`;
    let html = `
    <h3>Hi ${user.name} Bạn đã đăng ký tài khoản của chúng tôi xin hãy xác nhận kích hoạt tài khoản bằng cách<h3/>
    Bấm vào link <a href=http://127.0.0.1:3000/verify/account/${user.id}/${token}>này</a> để kích hoạt tài khoản của bạn`;
    await sendEmail(user.email, subject, text, html);
    res.status(400).json({
      message:
        'Link không hợp lệ hoặc đã hết hạn, Chúng tôi đã gửi lại email mới cho bạn vui lòng xác nhận nhanh chóng',
    });
  }
};
exports.Login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        userName: req.body.userName,
        isEnabled: 1,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: 'Mật khẩu không chính xác!',
      });
    }
    const accessToken = await jwtCustom.sign(
      {
        id: user.id,
        name: user.name,
        picture: user.picture,
        phone: user.phone,
        address: user.address,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      '2d'
    );
    const refreshToken = await jwtCustom.sign(
      {
        id: user.id,
        name: user.name,
        picture: user.picture,
        phone: user.phone,
        address: user.address,
        email: user.email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      '3h'
    );
    const response = { accessToken, refreshToken };
    user.refreshToken = refreshToken;
    await user.save();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (!refreshToken)
      return res.status(401).json({ message: 'Token hết hạn' });
    const user = await jwtCustom.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const accessToken = jwtCustom.sign(
      { user },
      process.env.ACCESS_TOKEN_SECRET,
      '2d'
    );
    res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.LoginGoogle = async (req, res) => {
  try {
    const client = new OAuth2Client(
      process.env.NODE_APP_GOOGLE_LOGIN_CLIENT_ID
    );
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NODE_APP_GOOGLE_LOGIN_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();
    let [user, created] = await User.findOrCreate({
      where: { email: email },
      defaults: {
        name,
        isEnabled: 1,
        userName: `google-${randomstring.generate(3)}`,
        email,
        picture,
        password: `${randomstring.generate()}`,
      },
    });
    user.setRoles([1]);
    const tokenCreated = await jwtCustom.sign(
      {
        id: user.id,
        name: user.name,
        picture: user.picture,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      '3d'
    );
    const dataUser = {
      id: user.id,
      name: user.name,
      picture: user.picture,
      email: user.email,
    };
    res.status(200).json({ data: dataUser, token: tokenCreated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.forgetUser = async (req, res) => {
  try {
    const t = await db.sequelize.transaction();
    const email = req.body.email;
    const user = await User.findOne(
      { where: { email: email } },
      { transaction: t }
    );
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Email không tồn tại trong hệ thống' });
    }
    const token = jwtCustom.sign(
      { id: user.id, name: user.name, picture: user.picture },
      process.env.ACCESS_TOKEN_SECRET,
      '3d'
    );
    let subject = 'Khôi phục lại tài khoản';
    let text = `Xin chào ${user.name} Hãy nhấn xác nhận đường link bên dưới để có thể lấy lại tài khoản của bạn, link chỉ có thời hạn 30p vui lòng xác nhận sớm! `;
    let html = `Bấm vào link<a href=http://localhost:3000/forget/${user.id}/${token}>Này</a> để khôi mục tài khoản của bạn`;
    await sendEmail(user.email, subject, text, html);
    res.status(200).json({
      status: 'Thành công',
      message: 'Link khôi phục mật khẩu đã được gửi tới email của bạn!',
    });
    await t.commit();
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};
exports.recoveryUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res
        .status(400)
        .json({ message: 'Link không hợp lệ hoặc đã hết hạn' });

    const decoded = await jwtCustom.verify(
      req.params.token,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!decoded) {
      return res
        .status(400)
        .json({ message: 'Link không hợp lệ hoặc đã hết hạn' });
    }
    user.password = bcrypt.hashSync(req.body.password, 8);
    await user.save();
    res.status(200).json({ message: 'Khôi phục mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
