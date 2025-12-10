
var forEach = function (obj, iterator) {
    if (Array.isArray(obj)) {
        obj.forEach(iterator);
        return;
    }
    Object.keys(obj).forEach(function (key) {
        iterator(obj[key], key);
    });
};

function generateJUnitXML(data, options) {
    var failures = 0;
    var cases = [];

    forEach(data.metrics, function (metric, metricName) {
        if (!metric.thresholds) {
            return;
        }
        forEach(metric.thresholds, function (threshold, thresholdName) {
            if (threshold.ok) {
                cases.push('<testcase name="' + escapeHTML(metricName) + ' - ' + escapeHTML(thresholdName) + '" classname="k6.thresholds" />');
            } else {
                failures++;
                cases.push(
                    '<testcase name="' + escapeHTML(metricName) + ' - ' + escapeHTML(thresholdName) + '" classname="k6.thresholds">\n' +
                    '\t<failure message="failed" />\n' +
                    '</testcase>'
                );
            }
        });
    });

    var name = (options && options.name) ? escapeHTML(options.name) : 'k6 thresholds';

    return (
        '<?xml version="1.0"?>\n' +
        '<testsuites tests="' + cases.length + '" failures="' + failures + '">\n' +
        '<testsuite name="' + name + '" tests="' + cases.length + '" failures="' + failures + '">' +
        cases.join('\n') +
        '</testsuite>\n' +
        '</testsuites>'
    );
}

function escapeHTML(s) {
    return s.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function textSummary(data, options) {
    // Simple text summary fallback
    var out = '   k6 results summary\n\n';

    // Check thresholds
    var thresholdFailures = 0;
    forEach(data.metrics, function (metric, name) {
        if (metric.thresholds) {
            forEach(metric.thresholds, function (threshold, key) {
                if (!threshold.ok) {
                    thresholdFailures++;
                    out += '    X ' + name + ': ' + key + '\n';
                }
            });
        }
    });

    if (thresholdFailures === 0) {
        out += '    ✓ All thresholds pass\n';
    } else {
        out += '    X ' + thresholdFailures + ' threshold(s) failed\n';
    }

    return out;
}

export { generateJUnitXML as jUnit, textSummary };
