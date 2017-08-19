import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';

import {Button, Row} from 'antd'
import { Flex, WingBlank } from 'antd-mobile';


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
  componentWillMount() {
    const tab = this.props.token ? 'feed' : 'all';
    const articlesPromise = this.props.token ?
      agent.Articles.feed :
      agent.Articles.all;

    // this.props.onLoad(tab, articlesPromise, Promise.all([agent.Tags.getAll(), articlesPromise()]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
    <div className="home-page" style={{marginTop: '1rem'}}>
      <div style={{padding: '0.2em'}}>
        
            <Link to="/laixe/themphuphi">
              <Button size={"large"} className="btn" type="primary" style={{width: '100%', height: '2rem', fontSize: '1rem'}}>Thêm mới</Button>
            </Link>
            <Link to="/laixe/danhsachphuphi">
              <Button size={"large"} className="btn" type="primary" style={{width: '100%', marginTop: '0.3rem', height: '2rem', fontSize: '1rem'}}>Danh sách</Button>
            </Link>
          </div>
        <div className="updateButton">
          <Link to="/laixe">
            <Button type="primary"
                    style={{width: 200, height: 60, fontSize: 30}}
            >Quay lại</Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
