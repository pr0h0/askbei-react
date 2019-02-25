import React, { Component } from "react";

export default class Notifications extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      data: []
    };
    this.tosNotification = this.tosNotification.bind(this);
    window.tosNotification = this.tosNotification;
  }
  tosNotification(nof) {
    this.setState(
      {
        items: [
          ...this.state.items,
          ...nof.map(n => (
            <div
              key={parseInt(Math.random() * Date.now(), 10)}
              className={"item " + n.className || ""}
            >
              <h3>{n.title}</h3>
              <p>{n.text}</p>
              <span>{new Date().toString().split(" ")[4]}</span>
            </div>
          ))
        ],
        data: [
          ...this.state.data,
          ...nof.map(n => ({
            title: n.title,
            key: Date.now(),
            text: n.text
          }))
        ]
      },
      () => {
        setTimeout(() => {
          let items = this.state.items;
          for (let i = 0; i < nof.length; i++) {
            items.splice(0, 1);
          }
          this.setState({ items });
        }, 5000);
      }
    );
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.nof) {
    }
  }
  render() {
    return <div className="notifications">{this.state.items}</div>;
  }
}
