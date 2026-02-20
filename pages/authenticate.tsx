import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { getProviders, signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/utils/cn';

import { authOptions } from './api/auth/[...nextauth]';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  console.log('sesion', session);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/hackernews-top-archive' } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] }
  };
}

export default function AuthenticationPage({
  providers
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <div className="container relative flex flex-col items-center justify-center min-h-[800px] md:grid">
        {/* <Link
          href="/examples/authentication"
          className={cn('absolute right-4 top-4 md:right-8 md:top-8')}>
          Login
        </Link> */}
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Nice to see you!</h1>
              {/* <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p> */}
            </div>
            <div className={cn('grid gap-6')}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">continue with</span>
                </div>
              </div>

              {Object.values(providers).map((provider) => (
                <Button
                  variant="outline"
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}>
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                  {provider.name?.toLocaleUpperCase()}
                </Button>
              ))}

              <Button variant="outline" type="button">
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
