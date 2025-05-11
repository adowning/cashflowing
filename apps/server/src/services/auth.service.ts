import { auth } from "../rest/auth";
import prisma from "@cashflow/db";
import { Session } from "better-auth";
import { decodeToken, generateAccessToken } from "../rest/jwt";
import db from "@cashflow/db";
import { dmmfToRuntimeDataModel } from "@cashflow/db/prisma/client/runtime/library";
import { GetSession, User } from "@cashflow/types";
import { v4 as randomUUIDv7 } from "uuid";

const { scrypt } = await import("node:crypto");
const crypto = await import("node:crypto");
import { HonoRequest } from "hono";
const salt = "82f13bc7362b2778b6dabc9dc93c0d15";
// Auth utility stubs - TODO: Implement properly
const validateUser = async (username: string, password: string) => {
  const user = await db.user.findFirst({
    where: { username },
    include: { activeProfile: { include: { operator: true } } },
  });

  if (user === null) {
    return null;
  }
  const isPasswordValid = await Bun.password.verify(
    password,
    user.passwordHash!
  );
  // const isPasswordValid = await Bun.password.verify("asdfasdf", user.passwordHash!);
  if (isPasswordValid === false) {
    return null;
  }
  return user;
};
export async function createUserWithProfileAndAccount(userData: {
  email: string;
  // email: string
  username: string;
  password: string;
  // name?: string
  // avatar?: string
  /// 800
}) {
  return db.$transaction(async (prisma) => {
    console.log("transaction");
    let defaultOperator: any = await db.operator.findFirst();
    let defaultOwnerUser: any = null;
    let defaultBank: any = null;
    let hashedPassword = await Bun.password.hash(userData.password);

    // Check if any operators exist
    if (!defaultOperator) {
      console.log(
        "No operators found. Creating a default owner, operator, and bank."
      );

      // Create a default owner user
      defaultOwnerUser = await db.user.create({
        data: {
          username: "default_operator_owner",
          email: "owner@example.com", // Use a placeholder or generate dynamically
          passwordHash: "hashed_password_for_owner", // Generate and hash a secure password
          name: "Default Operator Owner",
          status: "ACTIVE", // Set a default status
          // Add any other required fields for User
        },
      });

      // Create a default operator
      defaultOperator = await db.operator.create({
        data: {
          name: "Default Operator",
          slug: "default-operator", // Generate a unique slug
          owner: {
            connect: {
              id: defaultOwnerUser.id,
            },
          },
          isActive: true, // Set default status
          // Add any other required fields for Operator
        },
      });

      // Create a default bank for the new operator
      // defaultBank = await db.bank.create({
      //   data: {
      //     name: "Default Bank",
      //     currency: "USD", // Set a default currency
      //     operatorId: defaultOperator.id,
      //     isActive: true,
      //   },
      // });

      console.log(
        `Created default operator: ${defaultOperator.name} and owner: ${defaultOwnerUser.username} and bank: ${defaultBank.name}`
      );
    } else {
      // If operators exist, find a default bank linked to one of them
      // Assuming the first found operator has at least one bank, or find a bank directly
      // defaultBank = await db.bank.findFirst({
      //   where: {
      //     operatorId: defaultOperator.id, // Find a bank linked to the found operator
      //   },
      // });
      // if (!defaultBank) {
      //   // If no bank is found for the existing operator, create one
      //   defaultBank = await db.bank.create({
      //     data: {
      //       name: "Default Bank",
      //       currency: "USD", // Set a default currency
      //       operatorId: defaultOperator.id,
      //       isActive: true,
      //     },
      //   });
      //   console.log(`Created a default bank for existing operator: ${defaultOperator.name}`);
      // }
    }

    // Create the main user
    console.log("email ", userData.email);
    // const newUser = await db.user.create({
    //   data: {
    //     username: userData.username,
    //     email: `${userData.username}@asdf.com`, //`${userData.username}@asdf.com`,
    //     passwordHash: hashedPassword,
    //     name: userData.username,
    //     avatar: `blahblah.username.webp`,
    //     status: 'ACTIVE', // Set a default status
    //     balance: 0, // Initialize balance as Decimal
    //     // Set activeProfileId later after creating the profile if needed, or handle separately
    //     // Add any other required fields for User
    //   },
    // })
    try {
      const { headers, response } = await auth.api.signUpEmail({
        returnHeaders: true,
        //@ts-ignore
        body: {
          // id: clientId,
          email: userData.email,
          password: userData.password,
          name: userData.username, // Assuming username is used as name for signup
          username: userData.username,
          displayUsername: userData.username,
          emailVerified: true,
          image: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          totalXp: 0,
          balance: 0,
          isVerified: true,
          role: "MEMBER",
          active: true,
          lastLogin: new Date(),
          verificationToken: "",
          avatar: "",
          // activeProfileId: '',
          gender: "BOY",
          status: "ACTIVE",
          cashtag: "",
          phpId: Math.random() * 10000,
          accessToken: "",
          twoFactorEnabled: true,
          banned: true,
          banReason: "",
          banExpires: new Date(),
          lastDailySpin: new Date(),
        },
      });
      console.log("response", response);
      console.log("headers", headers);
      const newUser = response.user;
      const token = response.token;
      console.log(response);
      // Create the profile linked to the new user and the default operator/bank
      const newProfile = await db.profile.create({
        data: {
          // profileNumber: profileData.profileNumber,
          userId: newUser.id,
          shopId: defaultOperator.id, // Link to the default operator
          // bankId: defaultBank.id, // Link to the default bank
          // balance: profileData.balance ?? 0, // Use provided balance or default to 0 (Int)
          // xpEarned: profileData.xpEarned ?? 0,
          // isActive: profileData.isActive ?? true,
          // lastPlayed: profileData.lastPlayed,
          // phpId: profileData.phpId,
          // Add any other required fields for Profile
        },
      });

      // Optionally update the user's activeProfileId to the newly created profile's ID
      await db.user.update({
        where: { id: newUser.id },
        data: {
          activeProfileId: newProfile.id,
        },
      });

      // Create the account linked to the new user
      const newAccount = await db.account.create({
        data: {
          accountId: newUser.id,
          providerId: "credential",
          userId: newUser.id,
          // accessToken: accountData.accessToken,
          // refreshToken: accountData.refreshToken,
          // idToken: accountData.idToken,
          // accessTokenExpiresAt: accountData.accessTokenExpiresAt,
          // refreshTokenExpiresAt: accountData.refreshTokenExpiresAt,
          // scope: accountData.scope,
          password: hashedPassword, // Again, consider security implications
          createdAt: new Date(),
          updatedAt: new Date(),
          // Add any other required fields for Account
        },
      });

      console.log(
        `Created user: ${newUser.name}, profile: ${newProfile.id}, and account for provider: ${newAccount.id}`
      );

      return {
        user: newUser,
        profile: newProfile,
        account: newAccount,
        operator: defaultOperator, // Return the operator used
        ownerUser: defaultOwnerUser, // Return the owner user if created
        token,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  });
}

export const getUserFromHeader = async (req: any): Promise<User | null> => {
  console.log("getUserFromHeader");

  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return null;
  }
  const payload = decodeToken(token);
  if (payload.id === null || payload.id === undefined) return null;
  const user: any = await db.user.findUnique({
    where: { id: payload.id },
    include: {
      vipInfo: true,
      activeProfile: { include: { transactions: true } },
    },
  });

  if (user === null) {
    throw new Error("no user found");
    // return null;
  }
  if (user.activeProfile === null) {
    return null;
  } else {
    user.activeProfile = user.activeProfile[0];
  }
  return user;
};

export const getUserFromToken = async (token: string): Promise<User | null> => {
  console.log("getUserFromHeader");
  if (!token) {
    return null;
  }
  const payload = decodeToken(token);
  if (payload.id === null || payload.id === undefined) return null;
  const user: any = await db.user.findUnique({
    where: { id: payload.id },
    include: { activeProfile: { include: { operator: true } } },
  });

  if (user === null) {
    return null;
  }
  if (user.activeProfile === null) {
    return null;
  }

  return user;
};
export async function google(req: HonoRequest): Promise<Response> {
  // console.log(req);
  const json = await req.json();
  console.log(json);
  const _token = json.token;
  const signInUsername = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "http://localhost:3000/google",
      idToken: {
        token: _token, // Google Access Token
      },
    },
  });
  console.log(signInUsername);
  const user = signInUsername.user;
  const token = signInUsername.token;
  console.log(user);
  if (user == null) {
    return new Response(
      JSON.stringify({ message: "Invalid credentials", code: 401 }),
      { status: 401 }
    );
  }
  await db.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date(), isOnline: true },
  });
  // const token = generateAccessToken(user.id)

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  };

  return new Response(
    JSON.stringify({ authenticated: true, token, user, code: 200 }),
    {
      status: 200,
      headers: {
        "Set-Cookie": `token=${token}; ${Object.entries(cookieOptions)
          .map(([k, v]) => `${k}=${v}`)
          .join("; ")}`,
      },
    }
  );
}
export async function me(req: HonoRequest): Promise<Response> {
  // const session =  await prisma.platformSession.findUnique({
  //   where: { id: user.id },
  //   include: {
  //     user: {
  //       include: {
  //         activeProfile: { include: { operator: true } },
  //       },
  //     },
  //   },
  // });
  const session = await auth.api.getSession({
    headers: req.raw.headers,
  });
  if (!session || session == null) {
    return new Response(JSON.stringify({ message: "Unauthorized" }));
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {},
  });

  return new Response(
    JSON.stringify({
      // token: session?.session.token as string,
      // session: session as unknown as Session,
      user,
      code: 200,
    })
  );
  // return  session //new Response(JSON.stringify({ user, code: 200 }))
}

// app.post('/auth/register', async (c: Context) => {
export async function register(req: HonoRequest) {
  console.log("register");
  let { email, password, username } = await req.json();
  console.log(email);
  console.log(username);
  email = `${username}@cashflow.com`;
  //@ts-ignore
  const cookies = req.cookies;
  // if (email === undefined || password === undefined) {
  //   return new Response(
  //     JSON.stringify({ message: 'Missing username or password', code: 402 }),
  //   )
  // }

  const response = await createUserWithProfileAndAccount({
    email,
    password,
    username,
  });
  console.log("response", response);
  // const clientId = randomUUIDv7();

  // console.log(headers)
  console.log(response);
  // const token = await generateAccessToken(user.user.id)
  const token = response.token;
  const user = response.user;
  // cookies.set('cookie', token)
  //@ts-ignore
  // delete user.user.passwordHash
  // return new Response(
  //   JSON.stringify({ authenticated: true, token, user: user, code: 200 }),
  // )
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  };
  return new Response(
    JSON.stringify({ authenticated: true, user, code: 200 }),
    {
      status: 200,
      // headers: {
      //   'Set-Cookie': `token=${token}; ${Object.entries(cookieOptions)
      //     .map(([k, v]) => `${k}=${v}`)
      //     .join('; ')}`,
      // },
    }
  );
  // }
}

// app.post('/auth/login', async (c: Context) => {
export async function login(req: HonoRequest) {
  console.log("login");
  const { username, password } = await req.json();
  if (username === undefined || password === undefined) {
    return new Response(
      JSON.stringify({ message: "Missing username or password", code: 401 }),
      { status: 401 }
    );
  }
  let signInUsername;

  // const salt = crypto.randomBytes(16).toString('hex')

  try {
    signInUsername = await auth.api.signInUsername({
      body: { password, username },
    });
  } catch (e) {
    // console.log(e)
    // const email = `${username}@asdf.com`
    // signInUsername = await auth.api.signInEmail({
    //   body: { password, email },
    // })
    console.log(e);
  }

  console.log("signInUsername", signInUsername);
  // const user = await validateUser(username, password)
  const user = signInUsername?.user;
  const token = signInUsername?.token;
  console.log(user);
  if (user == null) {
    return new Response(
      JSON.stringify({ message: "Invalid credentials", code: 401 }),
      { status: 401 }
    );
  }
  await db.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date(), isOnline: true },
  });
  // const token = generateAccessToken(user.id)

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  };

  return new Response(
    JSON.stringify({ authenticated: true, token, user, code: 200 }),
    {
      status: 200,
      headers: {
        "Set-Cookie": `token=${token}; ${Object.entries(cookieOptions)
          .map(([k, v]) => `${k}=${v}`)
          .join("; ")}`,
      },
    }
  );
}
export async function logout(req: HonoRequest) {
  return new Response(JSON.stringify("ok"), {
    status: 200,
    headers: {
      "Set-Cookie": `token=;`,
    },
  });
}
// export default app
