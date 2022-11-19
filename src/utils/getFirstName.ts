import type { Session } from "next-auth";

export function getFirstNameFromSession(sessionData: Session | null) {
  if (sessionData) {
    const fullName = sessionData.user?.name?.split(" ");
    if (fullName) {
      const firstName = fullName[0];
      return firstName;
    }
  }
  return;
}
