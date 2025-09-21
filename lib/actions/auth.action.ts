'use server'

import { db , auth} from "@/firebase/admin";
import { cookies } from "next/headers";
import { use } from "react";

const one_week =  60 * 60 * 24 * 7;
export async function signup(params: SignUpParams) {
    const {uid , name, email} = params;

    try{
      const userRecord = await db.collection('users').doc(uid).get();

      if(userRecord.exists){
        return {
            success : false,
            message: 'User already exists. Please sign in instead.'
        }
      }

      await db.collection('users').doc(uid).set({
        name , email
      })

      return{
        success: true,
        message: 'Account created successfully.Please Sign in.'
      }
    } catch(e: any) {
        console.log('Error creating a user ', e);

        if(e.code === 'auth/email-already-exists'){
            return{
              success: false,
              message : 'This email is already in use.'  
            }
        }

        return {
            success: false,
            message: 'Failed to create an Account.'
        }
    }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    // Check if Firebase Admin SDK is available
   const userRecord = await auth.getUserByEmail(email);
    
   if(!userRecord){
    return{
        success: false,
        message: 'User does not exist. Create an account instead.'
    }
   }

   await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore =  await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn: one_week *1000,
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: one_week,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: "lax"
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try{
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

      const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

      if(!userRecord.exists)  return null;

      return{
        ...userRecord.data(),
        id: userRecord.id,
      } as User;

    } catch(e){
       console.log(e) ;
       return null;
    }

}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}

export async function getInterviewByUserId(userId : string): Promise<Interview[] |null> {
  const interviews = await db.collection('interviews')
  .where('userId', '==', userId)
  .orderBy('createdAt','desc')
  .get();

  return interviews.docs.map((doc) =>({
    id: doc.id,
    ...doc.data()
  })) as Interview[];
}

export async function geTLatestInterviews(params : GetLatestInterviewsParams): Promise<Interview[] |null> {
  const {userId, limit = 20} = params;

  const interviews = await db
  .collection('interviews')
  .orderBy('createdAt','desc')
  .where('finalized', '==', true)
  .where('userId', '!=', userId)
  .limit(limit)
  .get();

  return interviews.docs.map((doc) =>({
    id: doc.id,
    ...doc.data()
  })) as Interview[];
}