const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { hasPermission } = require('../utils');
const { transport, constructEmail } = require('./mail');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId)
      throw new Error('You must be logged in to do that!');
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );
    return item;
  },

  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: { id: args.id }
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{ id title user {id} }`);
    const ownsItem = item.user.id;
    const hasPermissions = await ctx.request.user.permissions.some(permission =>
      ['ADMIN', 'ITEMDELETE'].includes(permission)
    );
    if (!ownsItem && hasPermissions) {
      throw new Error('Insufficient permissions');
    }
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signUp(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    );

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    return user;
  },

  async signIn(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) throw new Error(`No such user found for ${email}`);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid password');
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    return user;
  },

  signOut(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'goodbye' };
  },

  async resetRequest(parent, args, ctx, info) {
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) throw new Error(`No such user found for ${args.email}`);
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;
    const response = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });

    const mailResponse = await transport.sendMail({
      from: 'Sick-fits',
      to: user.email,
      subject: 'Your password reset token',
      html: constructEmail(
        `Your password reset token is: 
				<a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
				Click here
				</a>`
      )
    });

    return { message: 'Success, email sent' };
  },

  async resetPassword(parent, args, ctx, info) {
    if (args.password !== args.confirmPassword)
      throw new Error('Passwords do not match');
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    if (!user) throw new Error('This token is either invalid or expired');
    const password = await bcrypt.hash(args.password, 10);
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: 0
      }
    });
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    return updatedUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    if (!ctx.request.userId)
      throw new Error('You must be logged in to do that!');
    const currentUser = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      info
    );
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions
          }
        },
        where: { id: args.userId }
      },
      info
    );
  },

  async addToCart(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) throw new Error('You must be logged in to do that!');
    const [existingCartItem] = await ctx.db.query.cartItems(
      {
        where: {
          user: { id: userId },
          item: { id: args.id }
        }
      },
      info
    );

    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem({
        where: {
          id: existingCartItem.id
        },
        data: {
          quantity: existingCartItem.quantity + 1
        }
      });
    }
    return ctx.db.mutation.createCartItem({
      data: {
        user: {
          connect: {
            id: userId
          }
        },
        item: {
          connect: {
            id: args.id
          }
        }
      }
    });
  },

  async removeFromCart(parent, args, ctx, info) {
    const cartItem = await ctx.db.query.cartItem(
      { where: { id: args.id } },
      `{ id, user { id }}`
    );
    if (!cartItem) throw new Error('No item found!');
    if (cartItem.user.id !== ctx.request.userId)
      throw new Error('Not the same user!');
    return ctx.db.mutation.deleteCartItem(
      {
        where: { id: args.id }
      },
      info
    );
  }
};

module.exports = Mutations;
