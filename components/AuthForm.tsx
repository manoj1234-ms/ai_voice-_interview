// "use client";

// import { z } from "zod";
// import Link from "next/link";
// import Image from "next/image";
// import { toast } from "sonner";
// import { auth } from "@/firebase/client";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";

// import { Form } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";

// import { signIn, signUp } from "@/lib/actions/auth.action";
// import FormField from "./FormField";
// import { useState } from "react";


// const authFormSchema = (type: FormType) => {
//   return z.object({
//     name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
//     email: z.string().email(),
//     password: z.string().min(3),
//   });
// };

// const AuthForm = ({ type }: { type: FormType }) => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const formSchema = authFormSchema(type);
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     setLoading(true);
//     try {
//       if (type === "sign-up") {
//         const { name, email, password } = data;

//         const userCredential = await createUserWithEmailAndPassword(
//           auth,
//           email,
//           password
//         );

//         const result = await signUp({
//           uid: userCredential.user.uid,
//           name: name!,
//           email,
//           password,
//         });

//         if (!result?.success) {
//           toast.error(result?.message);
//           return;
//         }

//         toast.success("Account created successfully. Please sign in.");
//         router.push("/sign-in");
//       } else {
//         const { email, password } = data;

//         const userCredential = await signInWithEmailAndPassword(
//           auth,
//           email,
//           password
//         );

//         const idToken = await userCredential.user.getIdToken();

//         if (!idToken) {
//           toast.error("Sign in failed. Please try again.");
//           return;
//         }

//         const result = await signIn({
//           email,
//           idToken,
//         });

//         if (!result?.success) {
//           toast.error(result?.message || "Sign in failed. Please try again.");
//           return;
//         }

//         toast.success("Signed in successfully.");
//         router.push("/");
//       }
//     } catch (error: any) {
//       console.error(error);
//       toast.error(`There was an error: ${error.message || error}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isSignIn = type === "sign-in";

//   return (
//     <div className="card-border lg:min-w-[566px]">
//       <div className="flex flex-col gap-6 card py-14 px-10">
//         <div className="flex flex-row gap-2 justify-center">
//           <Image src="/logo.svg" alt="logo" height={32} width={38} />
//           <h2 className="text-primary-100">PrepWise</h2>
//         </div>

//         <h3>Practice job interviews with AI</h3>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="w-full space-y-6 mt-4 form"
//           >
//             {!isSignIn && (
//               <FormField
//                 control={form.control}
//                 name="name"
//                 label="Name"
//                 placeholder="Your Name"
//                 type="text"
//               />
//             )}

//             <FormField
//               control={form.control}
//               name="email"
//               label="Email"
//               placeholder="Your email address"
//               type="email"
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               label="Password"
//               placeholder="Enter your password"
//               type="password"
//             />

//             <Button className="btn" type="submit" disabled={loading}>
//               {loading
//                 ? isSignIn
//                   ? "Signing In..."
//                   : "Creating Account..."
//                 : isSignIn
//                 ? "Sign In"
//                 : "Create an Account"}
//             </Button>
//           </form>
//         </Form>

//         <p className="text-center">
//           {isSignIn ? "No account yet?" : "Have an account already?"}
//           <Link
//             href={!isSignIn ? "/sign-in" : "/sign-up"}
//             className="font-bold text-user-primary ml-1"
//           >
//             {!isSignIn ? "Sign In" : "Sign Up"}
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthForm;

"use client"
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import FormField from './FormField';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { signIn, signup } from '@/lib/actions/auth.action';

// const formSchema = z.object({
//   username: z.string().min(2).max(50),
// })

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({type} : {type : FormType}) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        if(type === 'sign-up'){

          const {name, email, password} = values;

          const userCredential = await createUserWithEmailAndPassword(
            auth, email, password
          )

          const result = await signup({
            uid: userCredential.user.uid,
            name: name!,
            email,
            password,
          })

          if(!result?.success){
            toast.error(result?.message)
            return;
          }
          toast.success('Account created successfully.Please sign in.');
          router.push('/sign-in');
          // console.log('Sign-up', values);
        }
        else{

          const {email, password} = values;

          const userCredential = await signInWithEmailAndPassword(auth,email,password);

          const idToken = await userCredential.user.getIdToken();

          if(!idToken){
            toast.error('Sign in failed');
            return;
          }

          await signIn({
            email, idToken
          })
          //  console.log('Sign-in', values);
          toast.success('Sign in successfully.');
          router.push('/');
        }
    }
    catch (error){
      console.log(error);
      toast.error( `there was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className='card-border lg:min-w-[566px]'>
      <div className='flex flex-col gap-6 card py-14 px-10'>
        <div className='flex flex-row gap-2 justify-center'>
           <Image src= "/logo.svg" alt='logo' height= {32} width={38} />
           <h2 className='text-primary-100'>PrepWise</h2>
        </div>

        <h3> Practice  Job interview with AI </h3>
      
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
          {!isSignIn && (
            <FormField control={form.control}  name='name' label='Name' placeholder='Your Name'/>
          )}
          <FormField control={form.control}  name='email' label='Email' placeholder='Your Email Address' type='email'/>
          <FormField control={form.control}  name='password' label='Password' placeholder='Enter Your Password' type='password'/>
        <Button type="submit" className='
        btn'>{isSignIn ? 'Sign in' : 'Create an Account'}</Button>
      </form>
     </Form>

     <p className='text-center'>
          {isSignIn ? 'No Account yet ?' : 'Have an account already?' }
          <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className='font-bold text-user-primary ml-1'>
          {!isSignIn ? "Sign-in" : "Sign up"}
          </Link>
     </p>
    </div>
    </div>
  )
}

export default AuthForm
