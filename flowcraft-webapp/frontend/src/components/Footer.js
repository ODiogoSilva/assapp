import React from "react"

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";

import DotsVerticalIcon from "mdi-react/DotsVerticalIcon";
import CopyrightIcon from "mdi-react/CopyrightIcon";
import ReactIcon from "mdi-react/ReactIcon";
import MaterialUiIcon from "mdi-react/MaterialUiIcon"

// CSS imports
const styles = require("../styles/footer.css");

export class Footer extends React.Component {
    render () {
        return (
            <div style={{marginTop: 25}}>
                <AppBar position={"static"} color="primary">
                    <Toolbar>
                        <div className={styles.footerContainer}>
                            <Typography className={styles.footerText}>Flowcraft</Typography>
                            <CopyrightIcon size={12} color={"#f2f2f2"} style={{marginLeft: "5px", marginRight: "5px"}}/>
                            <Typography className={styles.footerText}>2018</Typography>
                            <DotsVerticalIcon color={"#f2f2f2"}/>
                            <Typography className={styles.footerText}>Made with <a style={{color: "#f2f2f2", textDecoration: "none"}} href={"https://www.djangoproject.com/"} target={"_blank"}>Django</a> +</Typography>
                            <a href={"https://reactjs.org/"} target={"_blank"}><ReactIcon style={{marginLeft: "5px", marginRight: "5px"}} color={"#e2cbf2"}/></a>
                            <Typography className={styles.footerText}>+</Typography>
                            <a href={"https://material-ui.com/"} target={"_blank"}><MaterialUiIcon style={{marginLeft: "5px", marginRight: "5px"}} color={"#f2f2f2"}/></a>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
};
