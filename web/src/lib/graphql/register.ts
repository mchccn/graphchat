import { gql } from "@apollo/client";

export const register = ({
  username,
  password,
  email,
}: {
  username: string;
  password: string;
  email: string;
}) => gql`
    mutation {
        register(input: {
            username: "${username}"
            password: "${password}"
            email: "${email}"
        }) {
            errors {
                status
                message
            }
            user {
                id
                username
                email
                displayName
                avatar
                description
                createdAt
                updatedAt
                status
                role
            }
        }
    }
`;
