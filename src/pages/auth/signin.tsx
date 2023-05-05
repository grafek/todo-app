import type { InferGetServerSidePropsType } from "next";
import { getProviders, signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    if (session && !pushed) {
      router.push("/");
      setPushed(true);
    }
  }, [router, session, pushed]);

  return (
    <section className="grid h-screen place-items-center">
      {providers
        ? Object.values(providers).map((provider) => {
            return (
              <div key={provider.name}>
                <button
                  onClick={() => signIn(provider.id)}
                  className="flex items-center gap-2 rounded-md border border-gray-400 p-4 font-semibold text-gray-300 shadow-md transition-all hover:bg-blue-950"
                >
                  <FcGoogle className="text-2xl" />
                  <span>Sign in with {provider.name}</span>
                </button>
              </div>
            );
          })
        : ""}
    </section>
  );
};

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignIn;
