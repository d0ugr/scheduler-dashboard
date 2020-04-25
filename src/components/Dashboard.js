import React, { Component } from "react";

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
    loading: false,
    focused: null
  }

  selectPanel(id) {
    this.setState((previousState) =>
      ({ focused: (!previousState.focused ? id : null) })
    );
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
