import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import Slider from "react-slick";
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { withRouter } from "react-router-dom";
import { getAllSpecialty } from '../../../services/userService';


class OutStandingDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: [],
            dataSpecialty: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }

    async componentDidMount() {
        this.props.loadTopDoctors();

        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            })
        }
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }
    }

    render() {
        let arrDoctors = this.state.arrDoctors;
        let { language } = this.props
        // arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors)
        return (
            <div className='section-share section-outstanding-doctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id="homepage.outstanding-doctor" />
                        </span>

                        <Link to={'/all-doctor'}><button className="btn-section"><FormattedMessage id="homepage.more-infor" /></button></Link>

                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {arrDoctors && arrDoctors.length > 0
                                && arrDoctors.map((item, index) => {
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                    }
                                    let nameVi = `${item.positionData.value_Vi}, ${item.lastName} ${item.firstName} `;
                                    let nameEn = `${item.positionData.value_En}, ${item.firstName} ${item.lastName}`;
                                    return (
                                        <div className='section-customize' key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className='customize-border'>
                                                <div className='outer-bg'>
                                                    <div className='bg-image section-outstanding-doctor'
                                                        style={{ backgroundImage: `url(${imageBase64})` }}
                                                    />
                                                </div>
                                                <div className='position text-center'>
                                                    <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                                    {/* <div>Cơ xương khớp</div> */}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                        </Slider>
                    </div>

                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctors())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
