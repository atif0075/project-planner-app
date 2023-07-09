import {
  Button,
  Icon,
  Navbar,
  Page,
  f7,
  List,
  ListItem,
  Progressbar,
  SwipeoutActions,
  SwipeoutButton,
  Card,
} from "framework7-react";
import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { get, getDatabase, ref, set, onValue } from "firebase/database";
const addIterationsPage = ({ f7route }) => {
     
  const database = getDatabase();
  const [tasks, setTasks] = useState([]);
  const uniqueId =
    Math.floor(Math.random() * Date.now()).toString(16) +
    Math.floor(Math.random() * Date.now()).toString(16);
  const addIteration = () => {
    f7.dialog.prompt("Enter iteration name", "Add Iteration", (name) => {
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
        ref(
          database,
          `xOT2CmFAb6ZGw0Xhi50b2VreUnr1/projects/${f7route.params.id}/` +
            `${uniqueId}`
        ),
        {
          name: name,
          createdAt: DateTime.now().toFormat("dd/MM/yyyy"),
          id: uniqueId,
        }
      );
      f7.toast.create({
        text: "Iteration added successfully",
        closeTimeout: 2000,
        cssClass: "color-green",
      });
    });
  };
  const confirmDelete = (id) => {
    f7.dialog.confirm(
      "Are you sure you want to delete this project?",
      "Delete Project",
      () => {
        set(
          ref(
            database,
            `xOT2CmFAb6ZGw0Xhi50b2VreUnr1/projects/${f7route.params.id}/${id}`
          ),
          {}
        );
        f7.toast.create({
          text: "Project deleted successfully",
          closeTimeout: 2000,
          cssClass: "color-green",
        });
      }
    );
  };

  useEffect(() => {
    const projectsRef = ref(
      database,
      `xOT2CmFAb6ZGw0Xhi50b2VreUnr1/projects/${f7route.params.id}`
    );

    onValue(projectsRef, (snapshot) => {
      let { id, name, createdAt, ...data } = snapshot.val();
      data = Object.values(data);
      // count progress by status completed over total tasks
      data.forEach((item) => {
        let total = 0;
        let completed = 0;

        for (const task of Object.values(item)) {
          if (typeof task === "object") {
            total++;
            if (task.status === "completed") {
              completed++;
            }
          }
        }

        item.progress = Math.round((completed / total) * 100);
      });
      data && setTasks(data);
    });
  }, []);
  return (
    <Page>
      <Navbar backLink title="Iterations" />

      <div className="block-title flex justify-between items-center">
        {f7route.params.name}
        <Button tonal small onClick={addIteration}>
          <Icon>
            <Icon material="add"></Icon>
          </Icon>
        </Button>
      </div>
      <List dividersIos outlineIos strongIos strong inset>
        {tasks.map((item, i) => (
          <ListItem
            title={item.name}
            link={`/add-stories/${f7route.params.id}/${item.id}/${item.name}/`}
            key={i}
            footer={item.createdAt}
            swipeout
          >
            {/* <div slot="after">
              <div className=" w-[100px] h-1 overflow-hidden">
                <Progressbar
                  progress={item.progress ? item.progress : 0}
                  color={item.progress === 100 ? "green" : "blue"}
                />
              </div>
            </div> */}
            <SwipeoutActions right>
              <SwipeoutButton
                color="red"
                onClick={() => {
                  confirmDelete(item.id);
                }}
              >
                Delete
              </SwipeoutButton>
            </SwipeoutActions>
          </ListItem>
        ))}
      </List>
      {!tasks.length && (
        <Card
          content={
            "No stories found, Add a new story by clicking the + button above"
          }
        ></Card>
      )}
    </Page>
  );
};

export default addIterationsPage;
