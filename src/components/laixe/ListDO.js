import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  LAIXE_DO_LOADED
} from '../../constants/actionTypes';

import {Button, Row, Icon, Spin} from 'antd'
import { List } from 'antd-mobile';
import ReactList from 'react-list';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import moment from 'moment'

const Promise = global.Promise;
const Item = List.Item;
const Brief = Item.Brief;

const mapStateToProps = state => ({
  ...state.laixe,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED }),

  onLoad: ( payload) =>
    dispatch({ type: LAIXE_DO_LOADED, payload }),
});

class ListDO extends React.Component {

  constructor(props){
    super(props)
    console.log(this.props)
  }

  componentWillMount() {
    const articlesPromise = agent.LaiXe.listDO
    this.props.onLoad(Promise.all([articlesPromise()]));
  }

  componentWillUnmount() {
    // this.props.onUnload();
  }



  render() {

    return (
      <div className="home-page" style={{marginTop: '1rem'}}>
        <h2 className="textCenter" style={{fontSize: '0.8rem'}}>Lịch sử chạy xe</h2>
        <Row className="laixe-listDO-Wr">
          {this.props.status.listDO && (<div>
            {this.props.listDO.map((el, index) => {
              return (
                <Link to={""}
                      key={index}
                >
                  <Item
                    className="list-do"
                    arrow="horizontal"
                    multipleLine
                    platform="android"
                  >
                    <b style={{color: 'red', fontWeight: 'bold'}}>{"DO" + (el._id + 10000)}</b>
                    
                    {!el.trangthai.daduyet && <b style={{color: 'orange'}}> [Đang chờ duyệt]</b> }
                    {el.trangthai.daduyet && (
                      ((el.trangthai.duyet) ?
                          (<b style={{color: 'green'}}> [Xác nhận]</b>) :
                          (<b style={{color: 'red'}}> [Hủy]</b>)
                      )
                    ) }
                    
                    <Brief>
                      <b style={{color: '#FEC713'}}>{moment(el.time).format('DD/MM/YYYY')}</b> |
                      <b style={{}}> {el.khachhang}</b>
                    </Brief>
                    <Brief><b style={{color: '#FE6A14'}}>{el.sodiem} điểm</b> | {el.diemxuatphat} -> {el.diemtrahang}</Brief>
                  </Item>
                </Link>
              )
            })
          }
          </div>)}
          
          {!this.props.status.listDO && (
            <div style={{textAlign: 'center', paddingTop: 50}}>
              <Spin  size="large" tip="Đang tải..." />
            </div>
          )}
        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListDO);
