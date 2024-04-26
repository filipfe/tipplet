import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/auth/confirm"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { pathname, origin } = request.nextUrl;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(`${origin}/sign-in`));
  }

  if (user) {
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL(`${origin}/`));
    }
    const { data: services } = await supabase
      .from("services")
      .select("id, href, name");
    const service = services?.find(({ href }) => pathname.startsWith(href));
    if (service) {
      const { data } = await supabase
        .from("user_services")
        .select("id")
        .match({ service_id: service.id, user_id: user.id })
        .single();
      return data
        ? response
        : NextResponse.redirect(`${origin}/unlock?name=${service.name}`);
    }
  }

  return response;
}
