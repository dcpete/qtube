import React from 'react';
import { connect } from 'react-redux';

import QtubeModal from '../components/QtubeModal';
import { closeModal } from '../actions/modal_actions';

const mapStateToProps = function (state) {
  return { 
    isShown: state.modal.isShown,
    component: state.modal.component,
    title: state.modal.title,
    tab: state.modal.tab,
    message: state.modal.message,
    alert: state.modal.alert,
    showCancel: state.modal.showCancelButton,
    showOk: state.modal.showOkButton,
    okAction: state.modal.okAction
  }
}

const mapDispatchToProps = { 
  closeModal
}

const QtubeModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps)(QtubeModal);
export default QtubeModalContainer;