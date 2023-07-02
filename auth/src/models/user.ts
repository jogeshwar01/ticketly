import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a User Model has - to make sure we pass email and password correctly
// build function on User itself - this is used so that we dont have to export the build function explicitly
// now we can just do User.build in order to create new user
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has - to fix typescript issue with mongoose
// for eg.) properties passed are email and pass while the ones that are created may have more like createdAt etc
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      // this 'String' type is from typescript
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    // done to get a consistent output from mongo - as diff services may be in diff languages
    // ret is the object thats just about to be turned into json
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// this done is used to be able to use async await in mongoose - we call it at end - this is just how it works
// don't use arrow function as then our 'this' would be overridden and would be in context of this file as opposed to UserDoc
// isModified will return true for the new user created also
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// denotes model function takes in userdoc and returns type usermodel
// these are generics in typescript - can see function by ctrl + click on model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
