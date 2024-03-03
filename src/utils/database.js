import { getCookie } from "./cookies";
import { sha256 } from "./utils";

const LOCAL = false;

let ENDPOINT;

if (LOCAL) {
  ENDPOINT = "http://localhost:3000/validate";
} else {
  ENDPOINT =
    "https://m7frrq2r75.execute-api.ap-southeast-2.amazonaws.com/Prod/validate";
}

export const verifyMember = (member) => {
  const body = JSON.stringify({
    method: "verify",
    member,
  });

  return fetch(ENDPOINT, {
    method: "POST",
    body,
  });
};

export const registerMembers = async (members) => {
  const auth = await sha256(getCookie("isAdmin"));

  const body = JSON.stringify({
    method: "register",
    auth,
    members,
  });

  return fetch(ENDPOINT, {
    method: "POST",
    body,
  });
};
