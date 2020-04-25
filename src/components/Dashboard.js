import React, { Component } from "react";
import axios from "axios";

import classnames from "classnames";

import Loading from "./Loading";
import Panel   from "./Panel";

import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
} from "helpers/selectors";
import {
  setInterview
} from "helpers/reducers.js";

const data = [
  {
    id:       1,
    label:    "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id:       2,
    label:    "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id:       3,
    label:    "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id:       4,
    label:    "Interviews Per Day",
    getValue: getInterviewsPerDay
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
    this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    this.socket.onmessage = event => {
      const data = JSON.parse(event.data);
      if (typeof data === "object" && data.type === "SET_INTERVIEW") {
        this.setState(previousState =>
          setInterview(previousState, data.id, data.interview)
        );
      }
    };
  }

  componentDidUpdate(_previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  componentWillUnmount() {
    this.socket.close();
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
                value={panel.getValue(this.state)}
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
