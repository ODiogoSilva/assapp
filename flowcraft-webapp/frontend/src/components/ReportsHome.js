import React from "react";

import {Redirect} from "react-router-dom";

import {
    DraggableView,
    LoadingScreen
} from "./ReportsBase"

import {HomeInnuendo} from "./innuendo/innuendo";
import {HomeInput} from "./Inspect";
import Header from "./Header";

import {service} from "../../config.json"


/**
 * Entry point for /reports URL
 *
 * Full component for Reports home page. It is responsible for handling
 * the Drag and Drop of report files OR the specification of runID for
 * fetching report data to the database. Other Home components can be
 * added depending on the service option stored in
 * flowcraft/frontend/config.json
 *
 * These components are responsible for gathering the report data JSON array
 * and then redirect to the /reports/app URL providing the report data in
 * the state of the URL.
 *
 */
export class ReportsHome extends DraggableView {

    constructor(props) {
        super(props);

        this.props.history.push("/reports");

        this.state = {
            "runId": "",
            "reportData": null,
            "filters": null,
            "highlights": null,
            "openModal": false,
            "dropData": null,
            "loading": false,
            "additionalInfo": {}
        };
    }

    /*
    This method can be used to set the additional information to pass to the
     ReportsApp or ReportsRedirect Component to be parsed after.
     */
    setAdditionalInfo = (additionalInfo) => {
        let additionalData = "";

        // Set additional info based on INNUENDO Login
        if (additionalInfo.innuendo !== undefined) {
            additionalData = {
                innuendo: {
                    userId: additionalInfo.innuendo.getUserId(),
                    species: additionalInfo.innuendo.species,
                    username: additionalInfo.innuendo.getUsername()
                }
            }
        }
        else {
            additionalData = additionalInfo;
        }

        this.setState({
            additionalInfo: additionalData
        })
    };


    render() {
        return (
            <div>
                {
                    this.state.reportData &&
                    <Redirect to={{
                        pathname: "/reports/app",
                        state: {
                            "data": this.state.reportData,
                            "filters": this.state.filters,
                            "highlights": this.state.highlights,
                            "additionalInfo": this.state.additionalInfo
                        }
                    }}/>
                }
                {
                    this.state.loading ?
                        <LoadingScreen/> :
                        <div>
                            {
                                service === "innuendo" ?
                                    <div>
                                        <Header
                                            homeRef={'/reports'}
                                            headerTitle={"Reports"}/>
                                        <HomeInnuendo
                                            route={"reports"}
                                            setAdditionalInfo={this.setAdditionalInfo}
                                            bypassLogin={this.props.location.state}
                                        />
                                    </div> :
                                    <div>
                                        <Header
                                            homeRef={'/reports'}
                                            headerTitle={"Reports"}/>
                                        <HomeInput route={"reports"}/>
                                    </div>
                            }
                        </div>
                }
            </div>
        )
    }
}