import React, { useState, useEffect } from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { Collapse } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const Members = () => {

    const [users, setUsers] = useState([]);
    const [membersCollapse, setMembersCollapse] = useState([]);
    const [oldCollapseIndes, setOldCollapseIndes] = useState(-1);


    useEffect(() => {
        axios.get(
            "/user",
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(json => {
            setUsers(json.data);

            let bool = [];
            for (let i = 0; i < json.data.length; i++) {
                bool.push(false);
            }
            setMembersCollapse(bool);

        }).catch((err) => {
            errorAlert(err.message);
        }
        );
    }, []);


    const toggleChecked = (index) => () => {

        let p = "";
        if (users[index].status === 'ACTIVE') {
            p = "/user/status_deactive/" + users[index].user_id;
        } else {
            p = "/user/status_active/" + users[index].user_id;
        }

        axios.put(
            p,
            {
                headers: {
                    Authorization: localStorage.getItem("Online-Shopping Authorization")
                }
            }
        ).then(response => {
            successfulAlert(response.data.message)
        }).catch((err) => {
            errorAlert(err.message);
        }
        );
    };

    const getDateFormat = (date) => {
        let a = new Date(date) + " ";
        let b = a.substring(0, 16);
        return b;
    }

    const updateCollapse = (index) => () => {
        let bool = [...membersCollapse];

        if (oldCollapseIndes !== -1) {
            bool[oldCollapseIndes] = false;
        }

        if (bool[index] === false) {
            setOldCollapseIndes(index);
        }

        bool[index] = !membersCollapse[index];
        setMembersCollapse(bool);
    }


    const successfulAlert = (message) => {
        toast.success(message,
            { position: toast.POSITION.TOP_RIGHT })
    }


    const errorAlert = (message) => {

        toast.error(message,
            { position: toast.POSITION.TOP_RIGHT })
    }


    const IOSSwitch = withStyles((theme) => ({
        root: {
            width: 55,
            height: 30,
            padding: 0,
            marginRight: theme.spacing(1),
        },
        switchBase: {
            padding: 4,
            '&$checked': {
                transform: 'translateX(26px)',
                color: theme.palette.common.white,
                '& + $track': {
                    backgroundColor: 'rgb(199, 123, 255)',
                    opacity: 1,
                    border: 'none',
                },
            },
            '&$focusVisible $thumb': {
                color: '#52d869',
                border: '6px solid #fff',
            },
        },
        thumb: {
            width: 22,
            height: 22,
            borderRadius: 22 / 2,
        },
        track: {
            borderRadius: 30 / 2,
            border: `1px solid ${theme.palette.grey[400]}`,
            backgroundColor: theme.palette.grey[50],
            opacity: 1,
            transition: theme.transitions.create(['background-color', 'border']),

        },
        checked: {},
        focusVisible: {},
    }))(({ classes, ...props }) => {
        return (
            <Switch
                focusVisibleClassName={classes.focusVisible}
                disableRipple
                classes={{
                    root: classes.root,
                    switchBase: classes.switchBase,
                    thumb: classes.thumb,
                    track: classes.track,
                    checked: classes.checked,
                }}
                {...props}
            />
        );
    });



    const renderAddresses = (addresses) => {
        return addresses.map(address => {
            return (
                <div className="col-12 col-sm-6 col-md-12 col-lg-6 p-1">
                    <div className="check-card">
                        <span className="text pt-0">{address.title}</span>
                        <span className="title">{address.address}</span>
                    </div>
                </div>
            )
        })
    }


    const renderContact = (contacts) => {
        return contacts.map(contact => {
            return (
                <div className="col-6 col-sm-6 col-md-6 p-1">
                    <div className="check-card">{contact.contact}</div>
                </div>
            )
        })
    }




    const renderUsers = () => {
        let index = 0;
        return users.map(user => {
            index++;
            return (
                <li className="w-100">
                    <hr className="mt-1" />
                    <div className={membersCollapse[index - 1] ? 'li-order menu-expanded' : 'li-order'} onClick={updateCollapse(index - 1)}>
                        <div className="" style={{ width: "75px", paddingRight: "5px" }}>
                            <img className="rounded-circle" src={user.user_image} style={{ width: "70px", height: "70px" }} alt={user.username} />
                        </div>
                        <div className="" style={{ width: "125px", paddingRight: "5px" }}>
                            <p className="m-0">
                                {user.username}
                            </p>
                        </div>
                        <div className="" style={{ width: "225px", paddingRight: "5px" }}>
                            <p className="m-0">
                                {
                                    user.email === null || user.email === "" ? ("--------------") : (user.email)
                                }
                            </p>
                        </div>
                        <div className="" style={{ width: "135px", paddingRight: "5px" }}>
                            <p className="m-0">
                                {getDateFormat(user.created_date)}
                            </p>
                        </div>
                        <div className="h-100 d-flex align-items-center" style={{ height: "40px" }}>
                            <div className="menu-arrow">
                                <i className="mdi mdi-chevron-left p-4"></i>
                            </div>
                        </div>
                    </div>
                    <Collapse className="w-100" in={membersCollapse[index - 1]}>
                        <div className="row m-0">
                            <div className="col-12 col-sm-12 col-md-6 p-0">
                                <div className="pl-4">
                                    <span className="text text-primary">Addresses</span>
                                </div>
                                <div className="row m-0">
                                    {
                                        user.addresses.length > 0 ? renderAddresses(user.addresses) : (<div className="m-2">-----------</div>)
                                    }
                                </div>
                                <div className="pl-4">
                                    <span className="text text-primary">Contacts</span>
                                </div>
                                <div className="row m-0">
                                    {
                                        user.contacts.length > 0 ? renderContact(user.contacts) : (<div className="m-2">-----------</div>)
                                    }
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-6 py-4">
                                <div>
                                    <div>
                                        <span className="title text-primary">Fullname: </span>
                                        <span className="text">{
                                            user.fullname === null || user.fullname === "" ? ("--------------") : (user.fullname)
                                        }</span>
                                    </div>
                                    <div>
                                        <span className="title text-primary">Gender: </span>
                                        <span className="text">{
                                            user.gender === null || user.gender === "" ? ("--------------") : (user.gender)
                                        }</span>
                                    </div>
                                    <div>
                                        <span className="title text-primary">Birthday: </span>
                                        <span className="text">{
                                            user.birthday === null || user.birthday === "" ? ("--------------") : getDateFormat(user.birthday)
                                        }</span>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between pt-4">
                                    <span className="title text-primary">Status: </span>
                                    
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<IOSSwitch checked={user.status === 'ACTIVE' ? (true) : (false)} onChange={toggleChecked(index - 1)} name="checkedB" />}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12">
                                Status
                            </div>
                        </div>
                    </Collapse>
                </li>
            )
        })
    }

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    <span className="page-title-icon bg-gradient-primary text-white mr-2">
                        <i className="mdi mdi-account-multiple"></i>
                    </span>
                    Members
                </h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Member</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Members</li>
                    </ol>
                </nav>
            </div>

            <div className="bg-white box-shadow p-2 p-md-3">

                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary d-flex align-items-center justify-content-center mr-2" style={{ minWidth: "30px", minHeight: "30px", borderRadius: "15px" }}>1</div>
                        <h5 className="m-0">Members</h5>
                    </div>
                    {/* <div>
                        <Link className="nav-link text-primary">
                            <small><i className="mdi mdi-plus"></i> Add Category</small>
                        </Link>
                    </div> */}
                </div>

                <div className="scroll pt-4">
                    <ul className="nav" style={{minWidth: "600px"}}>
                        {
                            renderUsers()
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Members