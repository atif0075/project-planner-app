import { Button, Navbar, Page } from "framework7-react";
import React, { useEffect, useState } from "react";
import { get, getDatabase, ref, set, update, child } from "firebase/database";
const viewTask = ({ f7route }) => {
  const database = getDatabase();
  let deProp = f7route.params.id;
  const [task, setTask] = useState({});
  const [status, setStatus] = useState("");
  const updateStatus = (status) => {
    update(
      ref(
        database,
        `xOT2CmFAb6ZGw0Xhi50b2VreUnr1/projects/${deProp.replace(/&/g, "/")}`
      ),
      {
        status: status === "pending" ? "completed" : "pending",
      }
    );
    setStatus(status === "pending" ? "completed" : "pending");
  };
  useEffect(() => {
    deProp = deProp.toString().replace(/&/g, "/");

    const projectsRef = ref(database);
    get(
      child(
        projectsRef,
        `xOT2CmFAb6ZGw0Xhi50b2VreUnr1/projects/${deProp.replace(/&/g, "/")}`
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          setTask(snapshot.val());
          setStatus(snapshot.val().status);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Page>
      <Navbar title="View Task" backLink />
      <div className="block-title ">{task.name}</div>
      <div className="card">
        <div
          className="card-content card-content-padding
        "
        >
          {task.desc ? task.desc : "No description"}
        </div>
      </div>
      <div className="px-4">
        <div className=" flex justify-end items-center">
          <Button
            tonal
            color={status === "pending" ? "green" : "red"}
            onClick={() => {
              updateStatus(status);
            }}
          >
            {status === "pending" ? "Mark Completed" : "Reopen"}
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default viewTask;
