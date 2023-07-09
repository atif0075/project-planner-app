import React, { useEffect, useState } from "react";
import {
  Page,
  Navbar,
  List,
  ListItem,
  Button,
  Icon,
  f7,
  SwipeoutActions,
  SwipeoutButton,
  Toolbar,
} from "framework7-react";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { get, getDatabase, ref, set, onValue } from "firebase/database";
import * as dayjs from "dayjs";
import { DateTime } from "luxon";
// capacitor local notification plugin
import { LocalNotifications } from "@capacitor/local-notifications";
const HomePage = (title, body) => {
  // if app is running in background and not opened
  const notifyUser = (title, body) => {
    LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: 1,
        },
      ],
    });
  };
  const database = getDatabase();
  const db = getFirestore();
  const [projects, setProjects] = useState([]);
  const uniqueId =
    Math.floor(Math.random() * Date.now()).toString(16) +
    Math.floor(Math.random() * Date.now()).toString(16);
  useEffect(() => {
    const projectsRef = ref(database, `xOT2CmFAb6ZGw0Xhi50b2VreUnr1/projects/`);
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      // setProjects(data);
      data && setProjects(Object.values(data));
    });
  }, []);
  const deleteProject = (id) => {
    f7.dialog.confirm(
      "Are you sure you want to delete this project?",
      "Delete Project",
      () => {
        set(ref(database, `xOT2CmFAb6ZGw0Xhi50b2VreUnr1/projects/${id}`), {});
        f7.toast.create({
          text: "Project deleted successfully",
          closeTimeout: 2000,
          cssClass: "color-green",
        });
      }
    );
  };

  const addProject = () => {
    f7.dialog.prompt("Enter project name", "Add Project", (name) => {
      if (name.trim().length === 0) {
        f7.toast
          .create({
            text: "Please enter a valid name",
            cssClass: "color-red",
            closeTimeout: 2000,
          })
          .open();
        return;
      }
      set(
        ref(database, `xOT2CmFAb6ZGw0Xhi50b2VreUnr1/projects/` + `${uniqueId}`),
        {
          name: name,
          id: uniqueId,
          createdAt: DateTime.now().toFormat("dd/MM/yyyy"),
        }
      );
      notifyUser("New Project Added", "Project added by Atif");
      f7.toast.create({
        text: "Project added successfully",
        closeTimeout: 2000,
        cssClass: "color-green",
      });
    });
  };
  return (
    <Page name="home">
      <Navbar sliding={false} title="Project Planner" />
      <div className="block-title flex  justify-between items-center">
        Projects
        <Button tonal small onClick={addProject}>
          <Icon material="add"></Icon>
        </Button>
      </div>

      <List dividersIos outlineIos strongIos strong inset>
        {projects.map((item, i) => (
          <ListItem
            title={item.name}
            link={`/add-iterations/${item.id}/${item.name}/`}
            key={i}
            footer="Created by Atif"
            after={item.createdAt}
            subtitle="Project"
            swipeout
          >
            <SwipeoutActions right>
              <SwipeoutButton
                color="red"
                onClick={() => deleteProject(item.id)}
              >
                Delete
              </SwipeoutButton>
            </SwipeoutActions>
          </ListItem>
        ))}
      </List>
      <Toolbar tabbar labels bottom>
        <div></div>
        <Button
          color="red"
          onClick={() => {
            f7.dialog.confirm(
              "Are you sure you want to logout?",
              "Logout",
              () => {
                f7.views.main.router.navigate("/login/");
                localStorage.removeItem("user");
                f7.toast.create({
                  text: "Logout successfully",
                  closeTimeout: 2000,
                  cssClass: "color-green",
                });
              }
            );
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </Page>
  );
};
export default HomePage;
