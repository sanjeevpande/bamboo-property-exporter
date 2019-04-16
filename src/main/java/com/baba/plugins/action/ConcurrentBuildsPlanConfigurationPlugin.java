package com.baba.plugins.action;

import com.atlassian.bamboo.plan.Plan;
import com.atlassian.bamboo.plan.TopLevelPlan;
import com.atlassian.bamboo.v2.build.BaseBuildConfigurationAwarePlugin;
import com.atlassian.bamboo.v2.build.configuration.MiscellaneousBuildConfigurationPlugin;
import com.atlassian.util.concurrent.NotNull;

public class ConcurrentBuildsPlanConfigurationPlugin extends BaseBuildConfigurationAwarePlugin implements MiscellaneousBuildConfigurationPlugin {

    public ConcurrentBuildsPlanConfigurationPlugin() {
    }

    public boolean isApplicableTo(@NotNull Plan plan) {
        return true;
    }
}
