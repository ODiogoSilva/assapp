// React imports
import React from "react"
import { Link, DirectLink } from 'react-scroll'

import classNames from "classnames";

import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import { withStyles } from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";

import ChartScatterplotHexbinIcon from "mdi-react/ChartScatterplotHexbinIcon";
import NotificationClearAllIcon from "mdi-react/NotificationClearAllIcon";
import CircleOutlineIcon from "mdi-react/CircleOutlineIcon";
import FileDocumentIcon from "mdi-react/FileDocumentIcon";
import ChevronLeftIcon from "mdi-react/ChevronLeftIcon";
import InformationIcon from "mdi-react/InformationIcon";
import SourceMergeIcon from "mdi-react/SourceMergeIcon";
import HeartPulseIcon from "mdi-react/HeartPulseIcon";
import TableLargeIcon from "mdi-react/TableLargeIcon";
import ChartLineIcon from "mdi-react/ChartLineIcon";
import AlienIcon from "mdi-react/AlienIcon";
import PillIcon from "mdi-react/PillIcon";
import PlusOutlineIcon from "mdi-react/PlusOutlineIcon";
import TournamentIcon from "mdi-react/TournamentIcon";
import TagIcon from "mdi-react/TagIcon";

import Header from "../Header";
import {themes} from "./themes";
import {theme} from "../../../config.json";
import Toolbar from "@material-ui/core/Toolbar";
import logo from  "../../../resources/Logo_small.png";


const styles = require("../../styles/drawer.css");

const tableDrawerStyles = {
    activeSideButton: {
        display: "flex",
        borderLeft: `7px solid ${themes[theme].palette.primary.main}`
    },
    ["svg path"]: {
        fill: themes[theme].palette.primary.main
    }
};


class TableOfContents extends React.Component {

    render() {

        return (
            <List style={{"paddingTop": 0}}>
                {this.props.tableHeaders &&
                <TableDrawer tableHeaders={this.props.tableHeaders}/>}
                {this.props.chartHeaders &&
                <ChartDrawer chartHeaders={this.props.chartHeaders}/>}
                {this.props.otherHeaders.length > 0 &&
                <OtherDrawer otherHeaders={this.props.otherHeaders}/>}
            </List>
        )
    }
}

export class ReportsHeader extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            drawerOpen: false,
            hoverOpen: false,
            tabValue: "0"
        };

        this.mouseOverTimer = null;
    }

    openDrawer = () => {
        this.setState({drawerOpen: true})
    };

    closeDrawer = () => {
        this.setState({drawerOpen: false})
    };

    scheduleMouseOver = () => {
        if (this.state.drawerOpen === false && this.state.hoverOpen === false){
            this.mouseOverTimer = setTimeout(() => {this.openDrawer()}, 350);
            this.setState({hoverOpen: true});
        }
    };

    cancelMouseOver = () => {
        if (this.state.hoverOpen === true){
            this.closeDrawer();
            this.setState({hoverOpen: false});
        }
        if (this.mouseOverTimer){
            clearTimeout(this.mouseOverTimer);
            this.mouseOverTimer = null;
        }
    };

    render () {

        const {classes} = this.props;

        return (
            <div>
                <Header
                        homeRef={'/reports'}
                        headerTitle={"Reports"}
                        runId={this.props.runId}
                        drawerButton={true}
                        drawer={this.state.drawerOpen}
                        openDrawer={this.openDrawer}/>

                <Drawer variant={"permanent"}
                        open={this.props.drawerOpen}
                        onMouseEnter={this.scheduleMouseOver}
                        onMouseLeave={this.cancelMouseOver}
                        classes={{paper: classNames(styles.drawerPaper, !this.state.drawerOpen && styles.drawerPaperClose)}}>
                    <div className={styles.toolbar}>
                        <img
                            src={logo}
                            alt={"logo"} height={"25"}/>
                        <IconButton className={styles.closeDrawerButton} onClick={this.closeDrawer}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </div>
                    <Divider/>
                    <Link activeClass={classes.activeSideButton} to={"reportOverview"} spy={true} smooth={true} duration={500} offset={-70}>
                        <DrawerButtonEntry icon={<InformationIcon/>}
                                           text={"Report Overview"} />
                    </Link>
                    {this.state.tabValue === "0" &&
                        <TableOfContents
                            otherHeaders={this.props.otherHeaders}
                            tableHeaders={this.props.tableHeaders}
                            chartHeaders={this.props.chartHeaders}
                        />
                    }
                </Drawer>
                <main className={classNames(styles.content, this.state.drawerOpen && styles.contentShift)}>
                    {this.props.children}
                </main>
            </div>
        )
    }
}
ReportsHeader = withStyles(tableDrawerStyles)(ReportsHeader);


class OtherDrawer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: true
        };

        this.toggleDrawer = this.toggleDrawer.bind(this)
    }

    toggleDrawer() {
        this.setState({"expanded": !this.state.expanded});
    }

    render () {
        const headerMap = {
            "phylogeny": {icon: <TournamentIcon/>, text: "Phylogenetics"}
        };

        const {classes} = this.props;

        return(
            <div>
                <DrawerHeader onClick={this.toggleDrawer} icon={<PlusOutlineIcon/>} text={"Other components"}/>
                <div className={classNames(this.state.expanded ? styles.subDrawerOpen : styles.subDrawerClose)}>
                    {
                        this.props.otherHeaders.map((h) => {
                            if (headerMap.hasOwnProperty(h)){
                                return (
                                    <Link activeClass={classes.activeSideButton} key={h} spy={true} to={`${h}`} smooth={true} duration={500} offset={-70}>
                                        <DrawerButtonEntry key={h} icon={headerMap[h].icon}
                                                           text={headerMap[h].text}/>
                                    </Link>
                                )
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}
OtherDrawer = withStyles(tableDrawerStyles)(OtherDrawer);


class ChartDrawer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: true
        };

        this.toggleDrawer = this.toggleDrawer.bind(this)
    }

    toggleDrawer() {
        this.setState({"expanded": !this.state.expanded});
    }

    render () {

        const headerMap =  {
            "base_n_content": {"icon": <HeartPulseIcon/>, "text": "FastQC"},
            "size_dist": {"icon": <ChartScatterplotHexbinIcon/>, "text": "Contig size"},
        };

        const {classes} = this.props;

        return (
            <div>
                <DrawerHeader onClick={this.toggleDrawer} icon={<ChartLineIcon/>} text={"Charts"}/>
                <div className={classNames(this.state.expanded ? styles.subDrawerOpen : styles.subDrawerClose)}>
                    {
                        this.props.chartHeaders.map((h) => {
                            if (headerMap.hasOwnProperty(h)){
                                return (
                                    <Link activeClass={classes.activeSideButton} key={h} spy={true} to={`${h}Chart`} smooth={true} duration={500} offset={-70}>
                                        <DrawerButtonEntry key={h} icon={headerMap[h].icon}
                                                           text={headerMap[h].text}/>
                                    </Link>
                                )
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}
ChartDrawer = withStyles(tableDrawerStyles)(ChartDrawer);

class TableDrawer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: true
        };

        this.toggleDrawer = this.toggleDrawer.bind(this)
    }

    toggleDrawer() {
        this.setState({"expanded": !this.state.expanded});
    }

    render () {

        const headerMap =  [
            {signature: "metadata", icon: <FileDocumentIcon/>, label: "Metadata"},
            {signature: "typing", icon: <TagIcon/>, label: "Typing"},
            {signature: "qc", icon: <HeartPulseIcon/>, label: "Quality Control"},
            {signature: "assembly", icon: <NotificationClearAllIcon/>, label: "Assembly"},
            {signature: "abricate", icon: <PillIcon/>, label: "AMR"},
            {signature: "chewbbaca", icon: <AlienIcon/>, label: "chewBBACA"},
            {signature: "phyloviz", icon: <SourceMergeIcon/>, label: "PHYLOViZ"},
            {signature: "plasmids", icon: <CircleOutlineIcon/>, label: "Plasmids"}
        ];

        const {classes} = this.props;

        return (
            <div>
                <DrawerHeader onClick={this.toggleDrawer} icon={<TableLargeIcon/>} text={"Tables"}/>
                <div className={classNames(this.state.expanded ? styles.subDrawerOpen : styles.subDrawerClose)}>
                    {
                        headerMap.map((h) => {
                                if (this.props.tableHeaders.includes(h.signature)) {
                                    return (
                                        <Link activeClass={classes.activeSideButton}
                                              key={h.signature}
                                              to={`${h.signature}Table`}
                                              spy={true}
                                              smooth={true} duration={500}
                                              offset={-100}>
                                            <DrawerButtonEntry icon={h.icon}
                                                               text={h.label}/>
                                        </Link>
                                    )
                                }
                            }
                        )
                    }
                </div>
            </div>
        )
    }
}
TableDrawer = withStyles(tableDrawerStyles)(TableDrawer);


class DrawerButtonEntry extends React.Component {

    render () {

        const style = {
            text: {
                fontSize: "16px",
                fontWeight: "bold",
                color: themes[theme].palette.primary.main,
                marginLeft: "10px"
            }
        };

        return(
                <ListItem button>
                    <ListItemIcon>
                        {this.props.icon}
                    </ListItemIcon>
                    <Typography style={style.text}>{this.props.text}</Typography>
                </ListItem>
        )
    }
}

class DrawerHeader extends React.Component {
    render () {
        return(
            <Paper onClick={this.props.onClick} className={styles.drawerHeader}>
                <ListItem>
                    <ListItemIcon>
                        {this.props.icon}
                    </ListItemIcon>
                    <ListItemText primary={this.props.text}/>
                </ListItem>
            </Paper>
        )
    }
}
