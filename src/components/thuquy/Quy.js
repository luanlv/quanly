import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
// import async from 'async'

import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio} from 'antd';
import moment from 'moment'

const { Column, ColumnGroup } = Table;
const Option = Select.Option;

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),

  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});

class Home extends React.Component {

  constructor (props) {

    super(props)

    this.state = {
      visible: false,
    }

    this.init()

  }

  init = async () => {

  }


  render() {

    return (
      <div className="home-page" style={{padding: 10, marginTop: 10}}>
        <Button type="primary" onClick={}>Thêm mới</Button>
        <hr/>


      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);