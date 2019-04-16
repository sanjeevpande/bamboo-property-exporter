AJS.$(document).ready(function() {

	var getLatestBuilds = function() {
		AJS.$.ajax({
			url: '/rest/api/latest/result?max-results=200',
			type: 'GET',
			dataType: 'json',
			success: function(response) {
				renderBuildUI(response.results.result || []);
			},
			error: function() {
				console.log('error');
			}
		});
	};

	var renderBuildUI = function(builds) {
		var wrapperDiv = AJS.$('<div>');
		wrapperDiv.append('<div class="build heading">\
				<span>Plan Name</span>\
				<span>Plan Key</span>\
				<span>Branch</span>\
				<span>Fetch Report</span>\
				<span>Prometheus Link</span>\
			</div>');
		builds.forEach(function(build) {
			var planName = build.plan.shortName;
			var planShortKey = build.plan.shortKey;
			var planKey = build.plan.planKey.key;
			var buildNo = build.buildNumber;
			var buildDiv = '<div class="build" data-planshortkey='+ planShortKey +' data-plankey='+ planKey +' data-jobkey=JOB1 data-buildno='+ buildNo +'>\
				<span>' + planName + '</span>\
				<span><a target="_blank" href="/browse/'+ planKey +'">' + planKey + '</a></span>\
				<span class="plan-branches"><a title="Fetch branches" class="aui-icon aui-icon-small aui-iconfont-arrows-down get-branches">-</a></span>\
				<span class="fetch-report"><a title="Fetch report" class="get-report">-</a></span>\
				<span class="report-link">-</span>\
				</div>';
			wrapperDiv.append(buildDiv);
		});
		AJS.$('#exporter-wrapper').append(wrapperDiv);
		bindReportEvents();
	};

	var bindReportEvents = function() {
		AJS.$('#exporter-wrapper').on('click', '.get-report', function(ev) {
			ev.preventDefault();
			if(!AJS.$(ev.target).hasClass('aui-icon')) {
				return;
			}
			var buildDiv = AJS.$(ev.target).closest('.build');
			if(buildDiv.length) {
				var dataset = buildDiv[0].dataset;
				var branchName = AJS.$(buildDiv).find('.planBranchName').val();
				var reportParam = branchName + '-' + dataset.jobkey;
				//var reportParam = dataset.plankey + '-' + dataset.jobkey + '-' + dataset.buildno;
				getBuildResult(reportParam, function(buildRes) {
					var builds = buildRes.results.result
					var latestBuildKey = builds && builds[0].buildResultKey;
					getBuildResult(latestBuildKey, function(metadataRes) {
						var reportJson = metadataRes.metadata.item;
						saveReportJson(reportJson, dataset.planshortkey, buildDiv.find('.report-link'));
					});
				});
			}
		});
		AJS.$('#exporter-wrapper').on('click', '.get-branches', function(ev) {
			ev.preventDefault();
			var buildDiv = AJS.$(ev.target).closest('.build');
			if(buildDiv.length) {
				var dataset = buildDiv[0].dataset;
				getBranches(dataset.plankey, function(branches) {
					buildBranchesHtml(branches, buildDiv);
				});
			}
		});
	};

	var getBranches = function(planKey, cb) {
		AJS.$.ajax({
			url: '/rest/api/latest/plan/' + planKey + '/branch?expand=branches',
			type: 'GET',
			dataType: 'json',
			success: function(response) {
				if(cb && typeof cb === 'function') {
					cb(response.branches.branch);
				}
			},
			error: function() {
				console.log('error');
			}
		});
	};

	var buildBranchesHtml = function(branches, buildDiv) {
		var select = document.createElement('select');
		select.className = 'planBranchName select';
		for(var i = 0; i < branches.length; i++) {
			var option = document.createElement('option');
			option.innerHTML = branches[i].shortName;
			option.value = branches[i].key;
			if(i == 0) {
				option.selected = true;
			}
			select.appendChild(option);
		}
		AJS.$(buildDiv).find('.plan-branches').html(select);
		AJS.$(buildDiv).find('.get-report').addClass('aui-icon aui-icon-small aui-iconfont-arrows-down');
	};

	var getBuildResult = function(reportParam, cb) {
		AJS.$.ajax({
			url: '/rest/api/latest/result/' + reportParam + '?expand=results,metadata',
			type: 'GET',
			dataType: 'json',
			success: function(response) {
				if(cb && typeof cb === 'function') {
					cb(response);
				}
			},
			error: function() {
				console.log('error');
			}
		});
	};

	var getLatestBranchBuild = function() {
		AJS.$.ajax({
			url: '/rest/api/latest/result/' + reportParam + '?expand=metadata',
			type: 'GET',
			dataType: 'json',
			success: function(response) {
				if(cb && typeof cb === 'function') {
					var builds = response.results.result;
					cb(builds);
				}
			},
			error: function() {
				console.log('error');
			}
		});
	};

	var saveReportJson = function(reportJson, planshortkey, reportLinkElem) {
		AJS.$.ajax({
			url: '/plugins/servlet/exporter/metrics/' + planshortkey,
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				reportJson: reportJson
			}),
			success: function(response) {
				var reportLink = "<a title='Prometheus Link' class='aui-icon aui-icon-small aui-iconfont-sidebar-link' target='_blank' href='/plugins/servlet/exporter/metrics/"+ planshortkey +"'>Report Link</a>";
				AJS.$(reportLinkElem).html(reportLink);
			},
			error: function() {
				console.log('error');
			}
		});
	};

	getLatestBuilds();

});
