[#if action.concurrentBuildsEnabled && planLevelConcurrentBuildConfig.defaultOverridden]
    [#assign labelValue]${planLevelConcurrentBuildConfig.effectiveNumberOfConcurrentBuilds}[#if !planLevelConcurrentBuildConfig.defaultOverridden] (${action.getText('global.default.used')})[/#if][/#assign]
    [@ww.label labelKey='build.concurrent.maxnumber' value='${labelValue}' /]
[/#if]