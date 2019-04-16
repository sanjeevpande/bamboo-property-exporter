/*package com.baba.plugins.action;

import com.atlassian.jira.web.action.JiraWebActionSupport;

@SuppressWarnings("serial")
public class Configuration extends JiraWebActionSupport {
    
    public Configuration() {
    }

    @Override
    public String doDefault() throws Exception {
        return SUCCESS;
    }
}*/


/*
package com.baba.plugins.action;

//import com.atlassian.jira.web.action.JiraWebActionSupport;
import com.atlassian.bamboo.plan.Plan;
import com.atlassian.bamboo.v2.build.BaseBuildConfigurationAwarePlugin;
import com.atlassian.bamboo.v2.build.configuration.MiscellaneousBuildConfigurationPlugin;

public class Configuration extends BaseBuildConfigurationAwarePlugin implements MiscellaneousBuildConfigurationPlugin {

    public Configuration() {
    }

    @Override
    public boolean isApplicableTo(Plan plan) {
        return true;
    }
}
*/

package com.baba.plugins.action;

import com.atlassian.bamboo.configuration.GlobalAdminAction;

import static webwork.action.Action.*;

public class Configuration extends GlobalAdminAction {
    public Configuration() {
    }

    @Override
    public String execute() {
        return SUCCESS;
    }

    @Override
    public String input() {
        return INPUT;
    }
}