import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';

import Auth from './Auth';

class QtubeModal extends Component {
  constructor() {
    super();
    this.renderModalHeader = this.renderModalHeader.bind(this);
    this.renderModalBody = this.renderModalBody.bind(this);
    this.renderModalFooter = this.renderModalFooter.bind(this);
    this.renderOkButton = this.renderOkButton.bind(this);
    this.renderCancelButton = this.renderCancelButton.bind(this);
    this.getModalSize = this.getModalSize.bind(this);
  }

  getModalSize() {
    switch (this.props.component) {
      case "auth":
        return "sm";
      default:
        return "md";
    }
  }

  renderModalHeader() {
    return (
      <ModalHeader toggle={this.props.closeModal}>
        {this.props.title}
      </ModalHeader>
    )
  }

  renderModalBody() {
    switch (this.props.component) {
      case "auth":
        return <Auth tab={this.props.tab} />
      default:
        return undefined;
    }
  }

  renderOkButton() {
    if (this.props.renderOkButton) {
      return (
        <Button
          color="secondary"
          onClick={this.props.okAction
            ? () => { }
            : this.props.closeModal}
        >
          Ok
        </Button>
      );
    }
  }

  renderCancelButton() {
    if (this.props.showCancelButton) {
      return (
        <Button>
          color="secondary"
          onClick={this.props.closeModal}
        </Button>
      );
    }
  }

  renderModalFooter() {
    if (this.props.showOkButton || this.props.showCancelButton) {
      return (
        <ModalFooter>
          {this.renderOkButton()}
          {this.renderCancelButton()}
        </ModalFooter>
      );
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.isShown} toggle={this.props.closeModal} size={this.getModalSize()} >
        {this.renderModalHeader()}
        <ModalBody>
          {this.renderModalBody()}
        </ModalBody>
        {this.renderModalFooter()}
      </Modal>
    )
  }
}

export default QtubeModal;