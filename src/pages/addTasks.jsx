import {
  Button,
  Icon,
  Navbar,
  Page,
  f7,
  List,
  ListItem,
  Card,
  PageContent,
  Block,
  Toolbar,
  Sheet,
  Link,
  ListInput,
  SwipeoutButton,
  SwipeoutActions,
} from "framework7-react";
import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { get, getDatabase, ref, set, onValue } from "firebase/database";
const addTasksPage = ({ f7route }) => {
   
  const database = getDatabase();
  const [sheetOpened, setSheetOpened] = useState(false);
  const [editSheetOpened, setEditSheetOpened] = useState(false);
  const [editId, setEditId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const uniqueId =
    Math.floor(Math.random() * Date.now()).toString(16) +
    Math.floor(Math.random() * Date.now()).toString(16);
  const addTask = () => {
    if (taskName.trim().length === 0) {
      f7.toast
        .create({
          text: "Please enter a valid name",
          cssClass: "color-red",
          closeTimeout: 2000,
        })
        .open();
      return;
    }
    const projectsRef = ref(
      database,
      `xOT2CmFAb6ZGw0Xhi50b2VreUnr1/projects/${f7route.params.projectId}/${f7route.params.iterationId}/${f7route.params.storyId}/${uniqueId}`
    );
    set(projectsRef, {
      name: taskName,
      desc: taskDesc,
      id: uniqueId,
      status: "pending",
      createdAt: DateTime.now().toFormat("dd/MM/yyyy"),
    });
    setSheetOpened(false);
    setTaskName("");
    setTaskDesc("");

    f7.toast
      .create({
        text: "Task added successfully",
        closeTimeout: 2000,
        cssClass: "color-green",
      })
      .open();
  };
  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskDesc, setEditTaskDesc] = useState("");
  const openEditTask = (id, name, desc) => {
    setEditSheetOpened(true);
    setEditTaskName(name);
    setEditTaskDesc(desc);
    setEditId(id);
  };
  const setEditTask = () => {
    if (editTaskName.trim().length === 0) {
      f7.toast
        .create({
          text: "Please enter a valid name",
          cssClass: "color-red",
          closeTimeout: 2000,
        })
        .open();
      return;
    }
    const projectsRef = ref(
      database,
      `xOT2CmFAb6ZGw0Xhi50b2VreUnr1/projects/${f7route.params.projectId}/${f7route.params.iterationId}/${f7route.params.storyId}/${editId}`
    );
    set(projectsRef, {
      name: editTaskName,
      desc: editTaskDesc,
      id: editId,
      createdAt: new Date(),
    });
    setEditSheetOpened(false);
    setEditTaskName("");
    setEditTaskDesc("");
    setEditId("");
    f7.toast
      .create({
        text: "Task updated successfully",
        closeTimeout: 2000,
        cssClass: "color-green",
      })
      .open();
  };
  useEffect(() => {
    const projectsRef = ref(
      database,
      `xOT2CmFAb6ZGw0Xhi50b2VreUnr1/projects/${f7route.params.projectId}/${f7route.params.iterationId}/${f7route.params.storyId}`
    );
    onValue(projectsRef, (snapshot) => {
      const { id, name, createdAt, progress, ...data } = snapshot.val();
      data && setTasks(Object.values(data));
    });
  }, []);
  const confirmDelete = (id) => {
    f7.dialog
      .create({
        title: "Delete",
        text: "Are you sure you want to delete this task?",
        buttons: [
          {
            text: "Cancel",
          },
          {
            text: "Delete",
            bold: true,
            color: "red",
            onClick: () => deleteTask(id),
          },
        ],
      })
      .open();
  };
  const deleteTask = (id) => {
    const projectsRef = ref(
      database,
      `xOT2CmFAb6ZGw0Xhi50b2VreUnr1/projects/${f7route.params.projectId}/${f7route.params.iterationId}/${f7route.params.storyId}/${id}`
    );
    set(projectsRef, {});
    f7.toast
      .create({
        text: "Task deleted successfully",
        closeTimeout: 2000,
        cssClass: "color-green",
      })
      .open();
  };

  return (
    <Page>
      <Navbar backLink title="Add Tasks" />

      <div className="block-title flex  justify-between items-center">
        {f7route.params.name}
        <Button tonal small onClick={() => setSheetOpened(true)}>
          <Icon>
            <Icon material="add"></Icon>
          </Icon>
        </Button>
      </div>
      <List swipeout mediaList strong insetMd outlineIos dividersIos>
        {tasks.map((item, i) => {
          return (
            <ListItem
              key={i}
              swipeout
              title={item.name}
              after={item.createdAt}
              text={item.desc ? item.desc : "No description"}
              link={`/view-task/${f7route.params.projectId}&${f7route.params.iterationId}&${f7route.params.storyId}&${item.id}`}
            >
              
              <div slot="subtitle">
                {item.status === "pending" ? (
                  <span className="text-red-500">Pending</span>
                ) : (
                  <span className="text-green-500">Completed</span>
                )}
              </div>
              <SwipeoutActions right>
                <SwipeoutButton overswipe color="green" onClick={() => {}}>
                  Reply
                </SwipeoutButton>
              </SwipeoutActions>
            </ListItem>
          );
        })}
      </List>
      <Sheet
        opened={sheetOpened}
        bottom
        style={{ height: "auto" }}
        onSheetClosed={() => {
          setSheetOpened(false);
        }}
      >
        <Toolbar>
          <div className="left"></div>
          <div className="right">
            <Link sheetClose>Close</Link>
          </div>
        </Toolbar>
        <PageContent>
          <Block>
            <List>
              <ListInput
                label="Task Name"
                type="text"
                placeholder="Enter task name"
                clearButton
                onChange={(e) => setTaskName(e.target.value)}
              />
              <ListInput
                label="Task Description"
                type="textarea"
                placeholder="Enter task description"
                clearButton
                className="resizeable"
                onChange={(e) => setTaskDesc(e.target.value)}
              />
              <Card>
                <Button tonal onClick={addTask}>
                  Add Task
                </Button>
              </Card>
            </List>
          </Block>
        </PageContent>
      </Sheet>
      <Sheet
        opened={editSheetOpened}
        bottom
        style={{ height: "auto" }}
        onSheetClosed={() => {
          setEditSheetOpened(false);
        }}
      >
        <Toolbar>
          <div className="left"></div>
          <div className="right">
            <Link sheetClose>Close</Link>
          </div>
        </Toolbar>
        <PageContent>
          <Block>
            <List>
              <ListInput
                label="Task Name"
                type="text"
                placeholder="Enter task name"
                clearButton
                value={editTaskName}
                onChange={(e) => setEditTaskName(e.target.value)}
              />
              <ListInput
                label="Task Description"
                type="textarea"
                placeholder="Enter task description"
                clearButton
                className="resizeable"
                value={editTaskDesc}
                onChange={(e) => setEditTaskDesc(e.target.value)}
              />
              <Card>
                <Button tonal onClick={setEditTask}>
                  Update Task
                </Button>
              </Card>
            </List>
          </Block>
        </PageContent>
      </Sheet>
    </Page>
  );
};

export default addTasksPage;
