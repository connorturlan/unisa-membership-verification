import { getCookie } from "./cookies";
import { sha256 } from "./utils";

export const verifyMember = (member) => {
  const body = JSON.stringify({
    method: "verify",
    member,
  });

  return fetch(
    "https://m7frrq2r75.execute-api.ap-southeast-2.amazonaws.com/Prod/validate",
    {
      method: "POST",
      body,
    }
  );
};

export const registerMembers = async (members) => {
  const auth = await sha256(getCookie("isAdmin"));

  const body = JSON.stringify({
    method: "register",
    auth,
    members,
  });

  return fetch(
    "https://m7frrq2r75.execute-api.ap-southeast-2.amazonaws.com/Prod/validate",
    {
      method: "POST",
      body,
    }
  );
};
