import React from "react";
import {
  Page,
  Navbar,
  ListInput,
  List,
  BlockTitle,
  Button,
  Card,
} from "framework7-react";
import store from "../../js/store";
const LoginPage = () => (
  <Page name="Login">
    <Navbar large sliding={false} title="Login" />
    <BlockTitle>Enter your credentials</BlockTitle>
    <List strongIos dividersIos insetIos>
      <ListInput
        label="Name"
        type="email"
        placeholder="Your email"
        clearButton
      />
      <ListInput
        label="Password"
        type="password"
        placeholder="Your password"
        clearButton
      />
    </List>
    <Card>
      <Button
        tonal
        onClick={() => {
          localStorage.setItem("user", "true");
          window.location.replace("/");
        }}
      >
        Login
      </Button>
    </Card>
  </Page>
);
export default LoginPage;
