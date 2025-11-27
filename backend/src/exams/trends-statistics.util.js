"use strict";
// ============================================================================
// TRENDS STATISTICS - Cálculos estatísticos e análise de tendências
// ============================================================================
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStatistics = calculateStatistics;
exports.analyzeTrend = analyzeTrend;
exports.compareWithReference = compareWithReference;
exports.detectOutliers = detectOutliers;
exports.calculateMovingAverage = calculateMovingAverage;
exports.groupByPeriod = groupByPeriod;
// ============================================================================
// ESTATÍSTICAS BÁSICAS
// ============================================================================
function calculateStatistics(dataPoints) {
    if (dataPoints.length === 0)
        return null;
    // Ordenar por data
    var sorted = __spreadArray([], dataPoints, true).sort(function (a, b) { return a.date.getTime() - b.date.getTime(); });
    var values = sorted.map(function (p) { return p.value; });
    var count = values.length;
    // Média
    var mean = values.reduce(function (sum, v) { return sum + v; }, 0) / count;
    // Mediana
    var sortedValues = __spreadArray([], values, true).sort(function (a, b) { return a - b; });
    var median = count % 2 === 0
        ? (sortedValues[count / 2 - 1] + sortedValues[count / 2]) / 2
        : sortedValues[Math.floor(count / 2)];
    // Min e Max
    var min = Math.min.apply(Math, values);
    var max = Math.max.apply(Math, values);
    // Desvio padrão
    var variance = values.reduce(function (sum, v) { return sum + Math.pow(v - mean, 2); }, 0) / count;
    var stdDev = Math.sqrt(variance);
    // Primeiro e último valor
    var earliest = sorted[0].value;
    var earliestDate = sorted[0].date;
    var latest = sorted[count - 1].value;
    var latestDate = sorted[count - 1].date;
    // Mudança percentual total
    var changePercent = earliest !== 0 ? ((latest - earliest) / earliest) * 100 : 0;
    // Mudança por mês
    var monthsDiff = (latestDate.getTime() - earliestDate.getTime()) / (30 * 24 * 60 * 60 * 1000);
    var changePerMonth = monthsDiff > 0 ? changePercent / monthsDiff : 0;
    return {
        count: count,
        mean: mean,
        median: median,
        min: min,
        max: max,
        stdDev: stdDev,
        latest: latest,
        latestDate: latestDate,
        earliest: earliest,
        earliestDate: earliestDate,
        range: max - min,
        changePercent: changePercent,
        changePerMonth: changePerMonth
    };
}
// ============================================================================
// ANÁLISE DE TENDÊNCIA (REGRESSÃO LINEAR)
// ============================================================================
function analyzeTrend(dataPoints) {
    if (dataPoints.length < 2)
        return null;
    // Ordenar por data
    var sorted = __spreadArray([], dataPoints, true).sort(function (a, b) { return a.date.getTime() - b.date.getTime(); });
    // Converter datas em números (meses desde o primeiro ponto)
    var firstDate = sorted[0].date.getTime();
    var x = sorted.map(function (p) { return (p.date.getTime() - firstDate) / (30 * 24 * 60 * 60 * 1000); }); // meses
    var y = sorted.map(function (p) { return p.value; });
    // Regressão linear: y = mx + b
    var n = x.length;
    var sumX = x.reduce(function (sum, v) { return sum + v; }, 0);
    var sumY = y.reduce(function (sum, v) { return sum + v; }, 0);
    var sumXY = x.reduce(function (sum, xi, i) { return sum + xi * y[i]; }, 0);
    var sumX2 = x.reduce(function (sum, xi) { return sum + xi * xi; }, 0);
    // Slope (inclinação) - taxa de mudança por mês
    var slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    // R² para medir confiança
    var meanY = sumY / n;
    var ssTotal = y.reduce(function (sum, yi) { return sum + Math.pow(yi - meanY, 2); }, 0);
    var yPred = x.map(function (xi) { return slope * xi + (meanY - slope * (sumX / n)); });
    var ssRes = y.reduce(function (sum, yi, i) { return sum + Math.pow(yi - yPred[i], 2); }, 0);
    var r2 = 1 - (ssRes / ssTotal);
    var confidence = Math.max(0, Math.min(1, r2)); // Normalizar 0-1
    // Determinar direção
    var direction;
    var description;
    var avgValue = meanY;
    var relativeSlope = (slope / avgValue) * 100; // % por mês
    if (Math.abs(relativeSlope) < 1) {
        // Mudança < 1% ao mês = estável
        direction = 'STABLE';
        description = 'Valores estáveis sem tendência clara';
    }
    else if (slope > 0) {
        direction = 'UP';
        if (relativeSlope > 5) {
            description = "Tend\u00EAncia de alta acentuada (+".concat(relativeSlope.toFixed(1), "% ao m\u00EAs)");
        }
        else {
            description = "Tend\u00EAncia de alta moderada (+".concat(relativeSlope.toFixed(1), "% ao m\u00EAs)");
        }
    }
    else {
        direction = 'DOWN';
        if (Math.abs(relativeSlope) > 5) {
            description = "Tend\u00EAncia de queda acentuada (".concat(relativeSlope.toFixed(1), "% ao m\u00EAs)");
        }
        else {
            description = "Tend\u00EAncia de queda moderada (".concat(relativeSlope.toFixed(1), "% ao m\u00EAs)");
        }
    }
    return {
        direction: direction,
        slope: relativeSlope,
        confidence: confidence,
        description: description
    };
}
// ============================================================================
// COMPARAÇÃO COM FAIXA DE REFERÊNCIA
// ============================================================================
function compareWithReference(value, referenceMin, referenceMax) {
    if (referenceMin === undefined || referenceMax === undefined) {
        return null;
    }
    var isInRange = value >= referenceMin && value <= referenceMax;
    var midPoint = (referenceMin + referenceMax) / 2;
    var halfRange = (referenceMax - referenceMin) / 2;
    // Distância normalizada do ponto médio
    var distanceFromNormal = halfRange !== 0 ? (value - midPoint) / halfRange : 0;
    // Percentil na faixa (0 = mínimo, 50 = meio, 100 = máximo)
    var percentile = referenceMax !== referenceMin
        ? ((value - referenceMin) / (referenceMax - referenceMin)) * 100
        : 50;
    return {
        isInRange: isInRange,
        distanceFromNormal: distanceFromNormal,
        percentile: Math.max(0, Math.min(100, percentile))
    };
}
// ============================================================================
// DETECÇÃO DE OUTLIERS (VALORES ANÔMALOS)
// ============================================================================
function detectOutliers(dataPoints) {
    if (dataPoints.length < 4)
        return [];
    var values = dataPoints.map(function (p) { return p.value; });
    var sorted = __spreadArray([], values, true).sort(function (a, b) { return a - b; });
    var n = sorted.length;
    // Usar método IQR (Interquartile Range)
    var q1Index = Math.floor(n * 0.25);
    var q3Index = Math.floor(n * 0.75);
    var q1 = sorted[q1Index];
    var q3 = sorted[q3Index];
    var iqr = q3 - q1;
    var lowerBound = q1 - 1.5 * iqr;
    var upperBound = q3 + 1.5 * iqr;
    // Encontrar índices de outliers
    var outlierIndices = [];
    dataPoints.forEach(function (point, index) {
        if (point.value < lowerBound || point.value > upperBound) {
            outlierIndices.push(index);
        }
    });
    return outlierIndices;
}
// ============================================================================
// SUAVIZAÇÃO DE DADOS (MOVING AVERAGE)
// ============================================================================
function calculateMovingAverage(dataPoints, windowSize) {
    if (windowSize === void 0) { windowSize = 3; }
    if (dataPoints.length < windowSize)
        return [];
    var sorted = __spreadArray([], dataPoints, true).sort(function (a, b) { return a.date.getTime() - b.date.getTime(); });
    var smoothed = [];
    for (var i = 0; i < sorted.length; i++) {
        var start = Math.max(0, i - Math.floor(windowSize / 2));
        var end = Math.min(sorted.length, start + windowSize);
        var window_1 = sorted.slice(start, end);
        var avg = window_1.reduce(function (sum, p) { return sum + p.value; }, 0) / window_1.length;
        smoothed.push({
            date: sorted[i].date,
            value: avg,
            original: sorted[i].value
        });
    }
    return smoothed;
}
// ============================================================================
// AGRUPAMENTO POR PERÍODO
// ============================================================================
function groupByPeriod(dataPoints, period) {
    if (dataPoints.length === 0)
        return [];
    var sorted = __spreadArray([], dataPoints, true).sort(function (a, b) { return a.date.getTime() - b.date.getTime(); });
    var groups = new Map();
    sorted.forEach(function (point) {
        var date = new Date(point.date);
        var key;
        switch (period) {
            case 'day':
                key = "".concat(date.getFullYear(), "-").concat(String(date.getMonth() + 1).padStart(2, '0'), "-").concat(String(date.getDate()).padStart(2, '0'));
                break;
            case 'week':
                var weekNum = getWeekNumber(date);
                key = "".concat(date.getFullYear(), "-W").concat(String(weekNum).padStart(2, '0'));
                break;
            case 'month':
                key = "".concat(date.getFullYear(), "-").concat(String(date.getMonth() + 1).padStart(2, '0'));
                break;
            case 'year':
                key = "".concat(date.getFullYear());
                break;
        }
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(point);
    });
    return Array.from(groups.entries()).map(function (_a) {
        var periodKey = _a[0], points = _a[1];
        var values = points.map(function (p) { return p.value; });
        var average = values.reduce(function (sum, v) { return sum + v; }, 0) / values.length;
        return {
            period: periodKey,
            periodStart: points[0].date,
            periodEnd: points[points.length - 1].date,
            values: values,
            average: average,
            count: values.length
        };
    });
}
// Helper: obter número da semana
function getWeekNumber(date) {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
