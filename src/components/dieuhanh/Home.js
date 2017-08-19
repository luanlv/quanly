import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import Avatar from '../_components/Avatar'

import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio} from 'antd';
import DO from './DO'

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  // onLoad: (tab, pager, payload) =>
  //   dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});

class Home extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      visible: false,
      data: {
        mien: 'bac'
      },
      phongban: []
    }
    // this.init()
  }

  render() {
    return (
      <div className="home-page" style={{marginTop: '1rem'}}>
        <Button type="primary" onClick={this.showModal}>Thêm mới</Button>
  
        <Modal
          title="Thêm phòng/ban mới"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="Thêm mới"
          cancelText="Đóng"
        >
          <DO />
        </Modal>
        
      </div>
    );
  }
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  
  hideModal = () => {
    this.setState({
      visible: false,
    });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
