// React imports
import React from "react"
import FileDrop from 'react-file-drop';

import {
    DraggableView,
    DragAndDropModal,
    LoadingScreen
} from "./ReportsBase"
import {
    findTableSignatures,
    findChartSignatures,
    findQcWarnings
} from "./reports/parsers";
import {
    QualityControlTable,
    AssemblyTable,
    AbricateTable,
    ChewbbacaTable,
    MetadataTable
} from "./reports/tables";

import {Innuendo, innuendoSteps} from "./reports/innuendo";
import {AssemblySizeDistChart, FastQcCharts} from "./reports/charts";
import {ReportsHeader} from "./reports/drawer";
import {ReportOverview} from "./reports/overview";


import {
    Link,
    DirectLink,
    Element,
    Events,
    animateScroll as scroll,
    scrollSpy,
    scroller
} from 'react-scroll'

import styles from "../styles/reports.css";

import {TaskButtons} from "./reports/task_buttons"

/**
 * This is the main wrapper of the reports app. The reports
 * application should be mounted via Redirect to this component for two reasons:
 *
 *  1. It provides drag and drop functionality for more reports
 *  2. It allows the state of the reports to be saved and associated with the
 *  URL. In this way, refreshing the reports app will retain the last saved
 *  data set.
 */
export class ReportsRedirect extends React.Component {

    constructor(props) {
        super(props);

        console.log("redirect start");

        let additionalInfo = this.props.location.state.additionalInfo;

        if (additionalInfo && additionalInfo.innuendo) {
            const userId = additionalInfo.innuendo.userId;
            // Set instance of class innuendo based on the userId collected
            // from history
            const innuendo = new Innuendo();
            innuendo.setUserId(userId);

            additionalInfo = {innuendo: innuendo};

        }
        else {
            additionalInfo = {};
        }

        console.log(additionalInfo);

        this.state = {
            // Retrieve the initial state of reportData from the URL state
            "reportData": this.props.location.state.data,
            // Additional info has additional information that can be passed
            // by the reportsRedirect. In this case, it can be user
            // information collected from INNUENDO
            "additionalInfo": additionalInfo,
            // Set to true to display a loading spinner while processing data
            "loading": true,
            // Property that controls the showing of the File drag and drop modal
            "openModal": false,
            // Stores the intermediate reportData before merging or removing
            // reportData.
            "dropData": []
        };

        this.handleDrop = this.handleDrop.bind(this)
    }

    // URL STATE HANDLING
    /*
    Method that restores the state of the URL to the last saved report data
    state. This is trigger on page unloading/reloading
     */
    _restoreUrlState() {

        // Get additional info object
        const additionalInfo = this.state.additionalInfo;

        // Set new additionalInfo userId for innuendo based on the current class
        // instance
        if (additionalInfo.innuendo){
            additionalInfo.innuendo = {userId: additionalInfo.innuendo.getUserId()}
        }

        // Set new history based on the current reportData and additionalInfo
        this.props.history.replace("/reports/app", {
            data: this.state.reportData,
            additionalInfo: additionalInfo
        });
    }

    /*
    Method that clears the state associated with the URL when the component
    is mounted. This is done to prevent performance issues when scrolling the
    app with very big reports.
     */
    _clearUrlState() {
        this.props.history.replace("/reports/app", {data: []});
        this.props.history.state = {data: [], additionalInfo: {}};
    }

    _cancelLoading() {
        this.setState({loading: false})
    }

    /*
    Callback that can be passed to children components to update the reportData
    state.
     */
    _updateState(reportData, additionalInfo){
        this.setState({
            reportData,
            additionalInfo
        })
    }

    // DRAG AND DROP METHODS
    /*
    Updates the reportData state and closes drag and drop modal
     */
    loadReports = (reportData) => {
        this.setState({"reportData": reportData});
        this.setModalState(false)
    };

    /*
    Merges the report JSON data provided in the dropped files with the existing
    reportData and triggers the update of the reportData state.
     */
    mergeReports = (reportData) => {
        const mergedData = [...reportData, ...this.state.reportData];
        this.loadReports(mergedData);
    };

    /*
    Set the state of the drag and drop modal. True shows the modal.
     */
    setModalState = (value) => {
        this.setState({openModal: value})
    };

    /*
    Function triggered when files are dropped into the reports.
     */
    handleDrop(files, event){

        const data = files[0];
        const reader = new FileReader();

        reader.onload = function (e){
            const jsonData = JSON.parse(e.target.result).data.results;

            if (this.state.reportData === null){
                this.setState({reportData: jsonData})
            } else {
                this.setState({dropData: jsonData});
                this.setModalState(true)
            }
            console.log(jsonData)
        }.bind(this);

        reader.readAsText(data)
    }

    componentDidMount() {
        // Add method that restores URL state on page relog
        window.addEventListener("beforeunload", this._restoreUrlState.bind(this));
        // Clear the current URL state with setTimeout to prevent blocking
        setTimeout(this._clearUrlState.bind(this), 100);
        // Clear the loading component
        setTimeout(this._cancelLoading.bind(this), 1000);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.loading !== nextState.loading)
            return true;

        if (this.state.reportData === nextState.reportData &&
            this.state.openModal === nextState.openModal) {
            return false
        } else {
            return true
        }
    }

    render() {
        return (
            <div>
                <FileDrop onDrop={this.handleDrop}>
                    <DragAndDropModal openModal={this.state.openModal}
                                      setModalState={this.setModalState}
                                      dropData={this.state.dropData}
                                      mergeReports={this.mergeReports}
                                      loadReports={this.loadReports}/>
                    {

                        this.state.loading ?
                            <LoadingScreen/> :
                            <div>
                                <ReportsApp reportData={this.state.reportData}
                                            additionalInfo={this.state.additionalInfo}
                                            updateState={this._updateState.bind(this)}/>
                            </div>
                    }
                </FileDrop>
            </div>
        )
    }
}

/**
 * Main Reports application component. It requires the reportData array of
 * JSONs to correctly render. The rendering of the specific components in the
 * reports is conditional on the data provided in the reportData array.
 */
class ReportsApp extends React.Component {

    componentDidUpdate(){
        // Updates the reportData state and any additional information
        // passed to the component
        if (this.props.updateState){
            this.props.updateState(this.props.reportData, this.props.additionalInfo)
        }
    }

    shouldComponentUpdate(nextProps, nextState){

        if (nextProps.reportData !== this.props.reportData){
            return true
        } else {
            return false
        }

    }

    render() {

        const {tableData, tableSamples} = findTableSignatures(this.props.reportData);
        const {charts, chartSamples} = findChartSignatures(this.props.reportData);
        const qcInfo = findQcWarnings(this.props.reportData);
        const tables = [...tableData.keys()];

        console.log(qcInfo)

        //
        // This is the main element where the Reports components will be added,
        // Their addition should be conditional on the presence of relevant
        // data in the this.state.reportData array, and each component should
        // be responsible for handling the data in any way they see fit.
        //
        return (
            <div>
                {/*<TaskButtons tableData={tableData}*/}
                             {/*tableSamples={tableSamples}/>*/}
                <ReportsHeader tableHeaders={tables}
                               chartHeaders={charts}>
                    <Element name={"reportOverview"}
                             className={styles.scrollElement}>
                        <ReportOverview
                            reportData={this.props.reportData}
                            tableSamples={tableSamples}
                            chartSamples={chartSamples}
                            qcInfo={qcInfo}/>
                    </Element>
                    {
                        tables.includes("metadata") &&
                        <Element name={"metadataTable"}
                                 className={styles.scrollElement}>
                            <MetadataTable
                                tableData={tableData.get("metadata")}
                                reportData={this.props.reportData} />
                        </Element>
                    }
                    {
                        tables.includes("qc") &&
                        <Element name={"qcTable"}
                                 className={styles.scrollElement}>
                            <QualityControlTable
                                tableData={tableData.get("qc")}
                                qcInfo={qcInfo}/>
                        </Element>
                    }
                    {
                        tables.includes("assembly") &&
                        <Element name={"assemblyTable"}
                                 className={styles.scrollElement}>
                            <AssemblyTable
                                tableData={tableData.get("assembly")}
                                qcInfo={qcInfo}/>
                        </Element>
                    }
                    {
                        tables.includes("abricate") &&
                        <Element name={"abricateTable"}
                                 className={styles.scrollElement}>
                            <AbricateTable
                                tableData={tableData.get("abricate")}/>
                        </Element>
                    }
                    {
                        tables.includes("chewbbaca") &&
                        <Element name={"chewbbacaTable"}
                                 className={styles.scrollElement}>
                            <ChewbbacaTable
                                tableData={tableData.get("chewbbaca")}
                                reportData={this.props.reportData}
                            />
                        </Element>
                    }
                    {
                        charts.includes("base_n_content") &&
                        <Element name={"base_n_contentChart"}
                                 className={styles.scrollElement}>
                            <FastQcCharts rawReports={this.props.reportData}/>
                        </Element>
                    }
                    {
                        charts.includes("size_dist") &&
                        <Element name={"size_distChart"}
                                 className={styles.scrollElement}>
                            <AssemblySizeDistChart
                                rawReports={this.props.reportData}/>
                        </Element>
                    }
                </ReportsHeader>
            </div>
        )
    }
}