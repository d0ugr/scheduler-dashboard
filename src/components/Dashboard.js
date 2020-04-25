import React, { Component } from "react";
import axios from "axios";

import classnames from "classnames";

import Loading from "./Loading";
import Panel   from "./Panel";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {

  state = {
    lloading:     true,
    focused:      null,
    days:         [],
    appointments: {},
    interviewers: {}
  }

  selectPanel(id) {
    this.setState((previousState) =>
      ({ focused: (!previousState.focused ? id : null) })
    );
  }

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));
    if (focused) {
      this.setState({ focused });
    }
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([ days, appointments, interviewers ]) => {
      this.setState({
        loading:      false,
        days:         days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });
  }

  componentDidUpdate(_previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <main className={classnames("dashboard", {
          "dashboard--focused": this.state.focused
         })}>
          {data
            .filter((panel) =>
              this.state.focused === null || this.state.focused === panel.id)
            .map((panel, _index) => (
              <Panel
                key={panel.id}
                label={panel.label}
                value={panel.value}
                onSelect={(_event) => this.selectPanel(panel.id)}
              />
            ))
          }
        </main>
      );
    }
  }

}

export default Dashboard;
