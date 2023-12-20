import React, { useEffect, useState, useRef } from "react";
import Header from "../../general/header";
import Content from "../../general/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVenusMars, faCakeCandles, faEarthAmerica, faBriefcase} from "@fortawesome/free-solid-svg-icons";
import {Select, Input, Button, DatePicker, Divider, Space } from "antd";
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import useViewModel from "./ViewModel"
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);



// Componente utilizzato per visualizzare i dati del profilo utente e modificarli

let goal_index = 0;
let hobbie_index = 0;

const ProfileView = () => {

    const {userData, getUser, setUser, updateUser} = useViewModel();


    const [goal_items, setGoalItems] = useState(['travel', 'study']);
    const [new_goal, setNewGoal] = useState('');
    const inputRefGoals = useRef(null);
 
    const [hobbie_items, setHobbieItems] = useState(['play', 'party']);
    const [new_hobbie, setNewHobbie] = useState('');
    const inputRefHobbies = useRef(null);

    // Variabile di stato per pasare alla modalità Edit
    const [edit_mode, setEditMode] = useState(false);
    const dateFormat = 'YYYY/MM/DD';

    useEffect(() => {
        getUser();
    },[]);

    const addItemGoal = (e) => {
        e.preventDefault();
        setGoalItems([...goal_items, new_goal || `New item ${goal_index++}`]);
        setNewGoal('');
        setTimeout(() => {
          inputRefGoals.current?.focus();
        }, 0);
    };

    const addItemHobbie = (e) => {
        e.preventDefault();
        setHobbieItems([...hobbie_items, new_hobbie || `New item ${hobbie_index++}`]);
        setNewHobbie('');
        setTimeout(() => {
        inputRefHobbies.current?.focus();
        }, 0);
    };

    return (
        <>
        <Header currentSelection={3}></Header>
        <Content>
            
            {userData.username && !edit_mode && 
                <section className="user-page-container" style={{backgroundColor: '#fff'}}>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-lg-4">
                            <div className="card user-card mb-4">
                                <div className="card-body text-center">
                                <img src={userData.avatar_image} alt="avatar" className="rounded-circle img-fluid" style={{width: '150px'}} />
                                <h5 className="my-3">{userData.username}</h5>
                                <p className="text-muted mb-4">{userData.biography}</p>
                                <div className="d-flex justify-content-center mb-2">
                                    <button type="button" className="btn btn-primary btn-msg" onClick={() => {setEditMode(true)}}>Edit</button>
                                </div>
                                </div>
                            </div>
                            <div className="card mb-4 mb-lg-0">
                                <div className="card-body p-0">
                                <ul className="list-group list-group-flush rounded-3">
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3 selected">
                                    <FontAwesomeIcon icon={faVenusMars} />
                                    <p className="mb-0">{userData.gender}</p>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon icon={faCakeCandles} />
                                    <p className="mb-0">{userData.birth_date}</p>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon icon={faEarthAmerica} />
                                    <p className="mb-0" style={{textTransform:"capitalize"}}>{userData.birth_country}</p>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon icon={faBriefcase} />
                                    <p className="mb-0">{userData.job}</p>
                                    </li>
                                </ul>
                                </div>
                            </div>
                            </div>
                            <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Full Name</p>
                                    </div>
                                    <div className="col-sm-9">
                                    <p className="text-muted mb-0">{userData.first_name + ' ' + userData.last_name}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Email</p>
                                    </div>
                                    <div className="col-sm-9">
                                    <p className="text-muted mb-0">{userData.email}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Wants to teach</p>
                                    </div>
                                    <div className="col-sm-9">
                                    <p className="text-muted mb-0" style={{textTransform:'capitalize'}}>{userData.native_l}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Wants to learn</p>
                                    </div>
                                    <div className="col-sm-9">
                                    <p className="text-muted mb-0" style={{textTransform:'capitalize'}}>{userData.new_l}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Points</p>
                                    </div>
                                    <div className="col-sm-9">
                                    <p className="text-muted mb-0">{userData.points.toFixed(1)}</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                <div className="card card-goals mb-4 mb-md-0">
                                    <div className="card-body">
                                        <p className="mb-4">Why I want to learn a new language</p>
                                        { !userData.goal1 && !userData.goal2 && !userData.goal3 && !userData.goal4 &&
                                        <h4 className="no-item-message">No goal chosen</h4>
                                        }
                                        { userData.goal1 &&
                                        <>
                                        <p className="mb-1" style={{fontSize: '.77rem'}}>{userData.goal1}</p>
                                        <div className="progress rounded" style={{height: '5px'}}>
                                            <div className="progress-bar" role="progressbar" style={{width: '80%'}} aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        </>
                                        }
                                        { userData.goal2 &&
                                        <>
                                        <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{userData.goal2}</p>
                                        <div className="progress rounded" style={{height: '5px'}}>
                                            <div className="progress-bar" role="progressbar" style={{width: '72%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        </>
                                        }
                                        { userData.goal3 && 
                                        <>
                                        <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{userData.goal3}</p>
                                        <div className="progress rounded" style={{height: '5px'}}>
                                            <div className="progress-bar" role="progressbar" style={{width: '89%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        </>
                                        }
                                        { userData.goal4 && 
                                        <>
                                        <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{userData.goal4}</p>
                                        <div className="progress rounded" style={{height: '5px'}}>
                                            <div className="progress-bar" role="progressbar" style={{width: '55%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        </>
                                        }
                                    </div>
                                </div>
                                </div>
                                <div className="col-md-6">
                                <div className="card card-hobbies mb-4 mb-md-0">
                                    <div className="card-body">
                                    <p className="mb-4">Hobbies</p>
                                    { !userData.hobbie1 && !userData.hobbie2 && !userData.hobbie3 && !userData.hobbie4 &&
                                    <h4 className="no-item-message">No hobbie chosen</h4>
                                    }
                                    { userData.hobbie1 && 
                                    <>
                                    <p className="mb-1" style={{fontSize: '.77rem'}}>{userData.hobbie1}</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '80%'}} aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    </>
                                    }
                                    { userData.hobbie2 && 
                                    <>
                                    <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{userData.hobbie2}</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '72%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    </>
                                    }
                                    { userData.hobbie3 && 
                                    <>
                                    <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{userData.hobbie3}</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '89%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    </>
                                    }
                                    { userData.hobbie4 && 
                                    <>
                                    <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{userData.hobbie4}</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '55%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    </>
                                    }
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
            {userData.username && edit_mode && 
                <section className="user-page-container" style={{backgroundColor: '#fff'}}>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-lg-4">
                            <div className="card user-card mb-4">
                                <div className="card-body text-center">
                                <img src={userData.avatar_image} alt="avatar" className="rounded-circle img-fluid" style={{width: '150px'}} />
                                <h5 className="my-3">{userData.username}</h5>
                                <TextArea rows={4} className="mb-3" placeholder="Write a short description of you" defaultValue={userData.biography} maxLength={50} onChange={(e) => {setUser("biography",e.target.value)}}/>
                                <div className="d-flex justify-content-center mb-2">
                                    <button type="button" className="btn btn-primary btn-msg" 
                                        onClick={ async () =>  {
                                                            const res = await updateUser();
                                                            console.log("THEN UPDATEUSER "+res);
                                                            res && setEditMode(false);
                                                        }
                                        }>Save</button>
                                </div>
                                </div>
                            </div>
                            <div className="card mb-4 mb-lg-0">
                                <div className="card-body p-0">
                                <ul className="list-group list-group-flush rounded-3">
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3 selected">
                                    <FontAwesomeIcon icon={faVenusMars} />
                                    <Select
                                        showSearch
                                        placeholder="Select your gender"
                                        optionFilterProp="children"
                                        defaultValue={userData.gender}
                                        onChange={(value) => {setUser("biography",value)}}
                                        filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={[
                                        {
                                            value: 'male',
                                            label: 'Male',
                                        },
                                        {
                                            value: 'female',
                                            label: 'Female',
                                        },
                                        {
                                            value: 'other',
                                            label: 'Other',
                                        },
                                        ]}
                                    />
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon icon={faCakeCandles} />
                                    <DatePicker placeholder="Your birth date" defaultValue={dayjs(userData.birth_date, dateFormat)} onChange={(date, dateString) => {setUser("birth_date",dateString)}}/>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon icon={faEarthAmerica} />
                                    <Select
                                        showSearch
                                        placeholder="Select your native country"
                                        optionFilterProp="children"
                                        defaultValue={userData.birth_country}
                                        onChange={(value) => {setUser("birth_country",value)}}
                                        filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={[
                                        {
                                            value: 'italy',
                                            label: 'Italy',
                                        },
                                        {
                                            value: 'spain',
                                            label: 'Spain',
                                        },
                                        {
                                            value: 'sweden',
                                            label: 'Sweden',
                                        },
                                        {
                                            value: 'england',
                                            label: 'England',
                                        },
                                        ]}
                                    />
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                        <FontAwesomeIcon icon={faBriefcase} />
                                        <Input className="job-field" placeholder="Your job" defaultValue={userData.job} onChange={(e) => {setUser("job", e.target.value)}}/>
                                    </li>
                                </ul>
                                </div>
                            </div>
                            </div>
                            <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Full Name</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Input placeholder="First Name" defaultValue={userData.first_name} onChange={(e) => {setUser("first_name", e.target.value)}} />
                                            </div>
                                            <div className="col-md-6">
                                                <Input placeholder="Last Name" defaultValue={userData.last_name} onChange={(e) => {setUser("last_name", e.target.value)}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Email</p>
                                    </div>
                                    <div className="col-sm-9">
                                    <p className="text-muted mb-0">{userData.email}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Wants to teach</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <Select
                                            showSearch
                                            placeholder="Native Language"
                                            optionFilterProp="children"
                                            defaultValue={userData.native_l}
                                            onChange={(value) => {setUser("native_l",value)}}
                                            filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            options={[
                                            {
                                                value: 'english',
                                                label: 'English',
                                            },
                                            {
                                                value: 'italian',
                                                label: 'Italian',
                                            },
                                            {
                                                value: 'spanish',
                                                label: 'Spanish',
                                            },
                                            {
                                                value: 'swedish',
                                                label: 'Swedish',
                                            },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Wants to learn</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <Select
                                            showSearch
                                            placeholder="New Lenguage"
                                            optionFilterProp="children"
                                            defaultValue={userData.new_l}
                                            onChange={(value) => {setUser("new_l",value)}}
                                            filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            options={[
                                                {
                                                    value: 'english',
                                                    label: 'English',
                                                },
                                                {
                                                    value: 'italian',
                                                    label: 'Italian',
                                                },
                                                {
                                                    value: 'spanish',
                                                    label: 'Spanish',
                                                },
                                                {
                                                    value: 'swedish',
                                                    label: 'Swedish',
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Points</p>
                                    </div>
                                    <div className="col-sm-9">
                                    <p className="text-muted mb-0">{userData.points}</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                <div className="card mb-4 mb-md-0">
                                    <div className="card-body">
                                        <p className="mb-4">Why I want to learn a new language</p>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your goal"
                                            onChange={(value) => {setUser("goal1", value)}}
                                            defaultValue={userData.goal1}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefGoals}
                                                    value={new_goal}
                                                    onChange={(e) => {setNewGoal(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemGoal}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={goal_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your goal"
                                            onChange={(value) => {setUser("goal2", value)}}
                                            defaultValue={userData.goal2}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefGoals}
                                                    value={new_goal}
                                                    onChange={(e) => {setNewGoal(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemGoal}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={goal_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your goal"
                                            onChange={(value) => {setUser("goal3", value)}}
                                            defaultValue={userData.goal3}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefGoals}
                                                    value={new_goal}
                                                    onChange={(e) => {setNewGoal(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemGoal}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={goal_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your goal"
                                            onChange={(value) => {setUser("goal4", value)}}
                                            defaultValue={userData.goal4}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefGoals}
                                                    value={new_goal}
                                                    onChange={(e) => {setNewGoal(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemGoal}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={goal_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <div className="col-md-6">
                                <div className="card mb-4 mb-md-0">
                                    <div className="card-body">
                                    <p className="mb-4">Hobbies</p>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your hobby"
                                            onChange={(value) => {setUser("hobbie1", value)}}
                                            defaultValue={userData.hobbie1}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefHobbies}
                                                    value={new_hobbie}
                                                    onChange={(e) => {setNewHobbie(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemHobbie}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={hobbie_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your hobby"
                                            onChange={(value) => {setUser("hobbie2", value)}}
                                            defaultValue={userData.hobbie2}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefHobbies}
                                                    value={new_hobbie}
                                                    onChange={(e) => {setNewHobbie(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemHobbie}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={hobbie_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your hobby"
                                            onChange={(value) => {setUser("hobbie3", value)}}
                                            defaultValue={userData.hobbie3}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefHobbies}
                                                    value={new_hobbie}
                                                    onChange={(e) => {setNewHobbie(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemHobbie}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={hobbie_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                        <div className='form-outline mb-4'>
                                            <Select
                                            style={{width: '100%'}}
                                            placeholder="Your hobby"
                                            onChange={(value) => {setUser("hobbie4", value)}}
                                            defaultValue={userData.hobbie4}
                                            dropdownRender={(menu) => (
                                                <>
                                                {menu}
                                                <Divider
                                                    style={{
                                                    margin: '8px 0',
                                                    }}
                                                />
                                                <Space
                                                    style={{
                                                    padding: '0 8px 4px',
                                                    }}
                                                >
                                                    <Input
                                                    placeholder="Please enter item"
                                                    ref={inputRefHobbies}
                                                    value={new_hobbie}
                                                    onChange={(e) => {setNewHobbie(e.target.value)}}
                                                    />
                                                    <Button type="text" onClick={addItemHobbie}>
                                                    Add item
                                                    </Button>
                                                </Space>
                                                </>
                                            )}
                                            options={hobbie_items.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </Content>
        </>
    );
};

export default ProfileView;