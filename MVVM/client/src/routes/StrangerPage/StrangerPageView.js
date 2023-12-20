import React, { useEffect } from "react";
import Header from "../../general/header";
import Content from "../../general/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVenusMars, faCakeCandles, faEarthAmerica, faBriefcase} from "@fortawesome/free-solid-svg-icons";
import useViewModel from "./ViewModel"

// Componente utilizzato per visualizzare i dati del profilo di un altro utente

const StrangerPageView = () => {

    const {strangerData, getStranger, handleClick} = useViewModel();

    useEffect(() => {

        getStranger();

    },[]);

    return (
        <>
        <Header></Header>
        <Content>
            {strangerData && <>
                <section className="user-page-container" style={{backgroundColor: '#fff'}}>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-lg-4">
                            <div className="card user-card mb-4">
                                <div className="card-body text-center">
                                <img src={strangerData.avatar_image} alt="avatar" className="rounded-circle img-fluid" style={{width: '150px'}} />
                                <h5 className="my-3">{strangerData.username}</h5>
                                <p className="text-muted mb-4">{strangerData.biography}</p>
                                <div className="d-flex justify-content-center mb-2">
                                    <button type="button" className="btn btn-primary btn-msg" onClick={() => {handleClick()}}>Message</button>
                                </div>
                                </div>
                            </div>
                            <div className="card mb-4 mb-lg-0">
                                <div className="card-body p-0">
                                <ul className="list-group list-group-flush rounded-3">
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3 selected">
                                    <FontAwesomeIcon icon={faVenusMars} />
                                    <p className="mb-0">{strangerData.gender}</p>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon icon={faCakeCandles} />
                                    <p className="mb-0">{strangerData.birth_date}</p>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon icon={faEarthAmerica} />
                                    <p className="mb-0" style={{textTransform:"capitalize"}}>{strangerData.birth_country}</p>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                    <FontAwesomeIcon icon={faBriefcase} />
                                    <p className="mb-0">{strangerData.job}</p>
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
                                    <p className="text-muted mb-0">{strangerData.first_name + ' ' + strangerData.last_name}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Email</p>
                                    </div>
                                    <div className="col-sm-9">
                                    <p className="text-muted mb-0">{strangerData.email}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Wants to teach</p>
                                    </div>
                                    <div className="col-sm-9">
                                    <p className="text-muted mb-0" style={{textTransform:'capitalize'}}>{strangerData.native_l}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Wants to learn</p>
                                    </div>
                                    <div className="col-sm-9">
                                    <p className="text-muted mb-0" style={{textTransform:'capitalize'}}>{strangerData.new_l}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                    <p className="mb-0">Points</p>
                                    </div>
                                    <div className="col-sm-9">
                                    <p className="text-muted mb-0">{strangerData.points.toFixed(1)}</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                <div className="card card-goals mb-4 mb-md-0">
                                    <div className="card-body">
                                        <p className="mb-4">Why I want to learn a new language</p>
                                        { !strangerData.goals[0] && !strangerData.goals[1] && !strangerData.goals[2] && !strangerData.goals[3] &&
                                        <h4 className="no-item-message">No goal chosen</h4>
                                        }
                                        { strangerData.goals[0] &&
                                        <>
                                        <p className="mb-1" style={{fontSize: '.77rem'}}>{strangerData.goals[0]}</p>
                                        <div className="progress rounded" style={{height: '5px'}}>
                                            <div className="progress-bar" role="progressbar" style={{width: '80%'}} aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        </>
                                        }
                                        { strangerData.goals[1] &&
                                        <>
                                        <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{strangerData.goals[1]}</p>
                                        <div className="progress rounded" style={{height: '5px'}}>
                                            <div className="progress-bar" role="progressbar" style={{width: '72%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        </>
                                        }
                                        { strangerData.goals[2] && 
                                        <>
                                        <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{strangerData.goals[2]}</p>
                                        <div className="progress rounded" style={{height: '5px'}}>
                                            <div className="progress-bar" role="progressbar" style={{width: '89%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        </>
                                        }
                                        { strangerData.goals[3] && 
                                        <>
                                        <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{strangerData.goals[3]}</p>
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
                                    { !strangerData.hobbies[0] && !strangerData.hobbies[1] && !strangerData.hobbies[2] && !strangerData.hobbies[3] &&
                                    <h4 className="no-item-message">No hobbie chosen</h4>
                                    }
                                    { strangerData.hobbies[0] && 
                                    <>
                                    <p className="mb-1" style={{fontSize: '.77rem'}}>{strangerData.hobbies[0]}</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '80%'}} aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    </>
                                    }
                                    { strangerData.hobbies[1] && 
                                    <>
                                    <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{strangerData.hobbies[1]}</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '72%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    </>
                                    }
                                    { strangerData.hobbies[2] && 
                                    <>
                                    <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{strangerData.hobbies[2]}</p>
                                    <div className="progress rounded" style={{height: '5px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '89%'}} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                    </div>
                                    </>
                                    }
                                    { strangerData.hobbies[3] && 
                                    <>
                                    <p className="mt-4 mb-1" style={{fontSize: '.77rem'}}>{strangerData.hobbies[3]}</p>
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
                </>
            }
        </Content>
        </>
    );
};

export default StrangerPageView;