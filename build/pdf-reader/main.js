var Ma = Object.defineProperty;
var Da = (s, e, t) => e in s ? Ma(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var Pe = (s, e, t) => Da(s, typeof e != "symbol" ? e + "" : e, t);
async function La() {
  const s = window.PDFViewerApplication;
  if (!(s != null && s.pdfDocument) || !(s != null && s.pdfViewer))
    throw new Error("PDF document not available");
  return {
    pdfDocument: s.pdfDocument,
    pdfViewer: s.pdfViewer,
    getCurrentPage: () => s.page || 1,
    getTitle: () => {
      var e;
      return ((e = s.documentInfo) == null ? void 0 : e.Title) || "Untitled";
    }
  };
}
async function Ba({
  getCurrentPage: s,
  pdfDocument: e,
  getTitle: t
}) {
  const n = s(), r = await e.getPage(n), a = document.createElement("canvas"), i = a.getContext("2d"), o = r.getViewport({ scale: 2 });
  return a.width = o.width, a.height = o.height, await r.render({
    canvasContext: i,
    viewport: o
  }).promise, new Promise((c, l) => {
    a.toBlob(
      (d) => {
        if (d) {
          const u = `${t()}_page_${n}.png`, f = new File([d], u, { type: "image/png" });
          c(f);
        } else
          l(new Error("Failed to convert canvas to blob"));
      },
      "image/png",
      0.95
    );
  });
}
var N;
(function(s) {
  s.assertEqual = (r) => {
  };
  function e(r) {
  }
  s.assertIs = e;
  function t(r) {
    throw new Error();
  }
  s.assertNever = t, s.arrayToEnum = (r) => {
    const a = {};
    for (const i of r)
      a[i] = i;
    return a;
  }, s.getValidEnumValues = (r) => {
    const a = s.objectKeys(r).filter((o) => typeof r[r[o]] != "number"), i = {};
    for (const o of a)
      i[o] = r[o];
    return s.objectValues(i);
  }, s.objectValues = (r) => s.objectKeys(r).map(function(a) {
    return r[a];
  }), s.objectKeys = typeof Object.keys == "function" ? (r) => Object.keys(r) : (r) => {
    const a = [];
    for (const i in r)
      Object.prototype.hasOwnProperty.call(r, i) && a.push(i);
    return a;
  }, s.find = (r, a) => {
    for (const i of r)
      if (a(i))
        return i;
  }, s.isInteger = typeof Number.isInteger == "function" ? (r) => Number.isInteger(r) : (r) => typeof r == "number" && Number.isFinite(r) && Math.floor(r) === r;
  function n(r, a = " | ") {
    return r.map((i) => typeof i == "string" ? `'${i}'` : i).join(a);
  }
  s.joinValues = n, s.jsonStringifyReplacer = (r, a) => typeof a == "bigint" ? a.toString() : a;
})(N || (N = {}));
var vs;
(function(s) {
  s.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(vs || (vs = {}));
const w = N.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), we = (s) => {
  switch (typeof s) {
    case "undefined":
      return w.undefined;
    case "string":
      return w.string;
    case "number":
      return Number.isNaN(s) ? w.nan : w.number;
    case "boolean":
      return w.boolean;
    case "function":
      return w.function;
    case "bigint":
      return w.bigint;
    case "symbol":
      return w.symbol;
    case "object":
      return Array.isArray(s) ? w.array : s === null ? w.null : s.then && typeof s.then == "function" && s.catch && typeof s.catch == "function" ? w.promise : typeof Map < "u" && s instanceof Map ? w.map : typeof Set < "u" && s instanceof Set ? w.set : typeof Date < "u" && s instanceof Date ? w.date : w.object;
    default:
      return w.unknown;
  }
}, h = N.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class pe extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (n) => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(a) {
      return a.message;
    }, n = { _errors: [] }, r = (a) => {
      for (const i of a.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(r);
        else if (i.code === "invalid_return_type")
          r(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          r(i.argumentsError);
        else if (i.path.length === 0)
          n._errors.push(t(i));
        else {
          let o = n, c = 0;
          for (; c < i.path.length; ) {
            const l = i.path[c];
            c === i.path.length - 1 ? (o[l] = o[l] || { _errors: [] }, o[l]._errors.push(t(i))) : o[l] = o[l] || { _errors: [] }, o = o[l], c++;
          }
        }
    };
    return r(this), n;
  }
  static assert(e) {
    if (!(e instanceof pe))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, N.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, n = [];
    for (const r of this.issues)
      if (r.path.length > 0) {
        const a = r.path[0];
        t[a] = t[a] || [], t[a].push(e(r));
      } else
        n.push(e(r));
    return { formErrors: n, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
pe.create = (s) => new pe(s);
const gn = (s, e) => {
  let t;
  switch (s.code) {
    case h.invalid_type:
      s.received === w.undefined ? t = "Required" : t = `Expected ${s.expected}, received ${s.received}`;
      break;
    case h.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(s.expected, N.jsonStringifyReplacer)}`;
      break;
    case h.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${N.joinValues(s.keys, ", ")}`;
      break;
    case h.invalid_union:
      t = "Invalid input";
      break;
    case h.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${N.joinValues(s.options)}`;
      break;
    case h.invalid_enum_value:
      t = `Invalid enum value. Expected ${N.joinValues(s.options)}, received '${s.received}'`;
      break;
    case h.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case h.invalid_return_type:
      t = "Invalid function return type";
      break;
    case h.invalid_date:
      t = "Invalid date";
      break;
    case h.invalid_string:
      typeof s.validation == "object" ? "includes" in s.validation ? (t = `Invalid input: must include "${s.validation.includes}"`, typeof s.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${s.validation.position}`)) : "startsWith" in s.validation ? t = `Invalid input: must start with "${s.validation.startsWith}"` : "endsWith" in s.validation ? t = `Invalid input: must end with "${s.validation.endsWith}"` : N.assertNever(s.validation) : s.validation !== "regex" ? t = `Invalid ${s.validation}` : t = "Invalid";
      break;
    case h.too_small:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "more than"} ${s.minimum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "over"} ${s.minimum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "bigint" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(s.minimum))}` : t = "Invalid input";
      break;
    case h.too_big:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "less than"} ${s.maximum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "under"} ${s.maximum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "bigint" ? t = `BigInt must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly" : s.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(s.maximum))}` : t = "Invalid input";
      break;
    case h.custom:
      t = "Invalid input";
      break;
    case h.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case h.not_multiple_of:
      t = `Number must be a multiple of ${s.multipleOf}`;
      break;
    case h.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, N.assertNever(s);
  }
  return { message: t };
};
let ja = gn;
function Ua() {
  return ja;
}
const Wa = (s) => {
  const { data: e, path: t, errorMaps: n, issueData: r } = s, a = [...t, ...r.path || []], i = {
    ...r,
    path: a
  };
  if (r.message !== void 0)
    return {
      ...r,
      path: a,
      message: r.message
    };
  let o = "";
  const c = n.filter((l) => !!l).slice().reverse();
  for (const l of c)
    o = l(i, { data: e, defaultError: o }).message;
  return {
    ...r,
    path: a,
    message: o
  };
};
function _(s, e) {
  const t = Ua(), n = Wa({
    issueData: e,
    data: s.data,
    path: s.path,
    errorMaps: [
      s.common.contextualErrorMap,
      // contextual error map is first priority
      s.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === gn ? void 0 : gn
      // then global default map
    ].filter((r) => !!r)
  });
  s.common.issues.push(n);
}
class ne {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const n = [];
    for (const r of t) {
      if (r.status === "aborted")
        return P;
      r.status === "dirty" && e.dirty(), n.push(r.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, t) {
    const n = [];
    for (const r of t) {
      const a = await r.key, i = await r.value;
      n.push({
        key: a,
        value: i
      });
    }
    return ne.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, t) {
    const n = {};
    for (const r of t) {
      const { key: a, value: i } = r;
      if (a.status === "aborted" || i.status === "aborted")
        return P;
      a.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), a.value !== "__proto__" && (typeof i.value < "u" || r.alwaysSet) && (n[a.value] = i.value);
    }
    return { status: e.value, value: n };
  }
}
const P = Object.freeze({
  status: "aborted"
}), Ye = (s) => ({ status: "dirty", value: s }), re = (s) => ({ status: "valid", value: s }), Ss = (s) => s.status === "aborted", As = (s) => s.status === "dirty", Ze = (s) => s.status === "valid", Ft = (s) => typeof Promise < "u" && s instanceof Promise;
var b;
(function(s) {
  s.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, s.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(b || (b = {}));
class Se {
  constructor(e, t, n, r) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = r;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const ks = (s, e) => {
  if (Ze(e))
    return { success: !0, data: e.value };
  if (!s.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new pe(s.common.issues);
      return this._error = t, this._error;
    }
  };
};
function T(s) {
  if (!s)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: n, description: r } = s;
  if (e && (t || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: r } : { errorMap: (i, o) => {
    const { message: c } = s;
    return i.code === "invalid_enum_value" ? { message: c ?? o.defaultError } : typeof o.data > "u" ? { message: c ?? n ?? o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: c ?? t ?? o.defaultError };
  }, description: r };
}
class F {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return we(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: we(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new ne(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: we(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (Ft(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const n = this.safeParse(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  safeParse(e, t) {
    const n = {
      common: {
        issues: [],
        async: (t == null ? void 0 : t.async) ?? !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: we(e)
    }, r = this._parseSync({ data: e, path: n.path, parent: n });
    return ks(n, r);
  }
  "~validate"(e) {
    var n, r;
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: we(e)
    };
    if (!this["~standard"].async)
      try {
        const a = this._parseSync({ data: e, path: [], parent: t });
        return Ze(a) ? {
          value: a.value
        } : {
          issues: t.common.issues
        };
      } catch (a) {
        (r = (n = a == null ? void 0 : a.message) == null ? void 0 : n.toLowerCase()) != null && r.includes("encountered") && (this["~standard"].async = !0), t.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: t }).then((a) => Ze(a) ? {
      value: a.value
    } : {
      issues: t.common.issues
    });
  }
  async parseAsync(e, t) {
    const n = await this.safeParseAsync(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  async safeParseAsync(e, t) {
    const n = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: we(e)
    }, r = this._parse({ data: e, path: n.path, parent: n }), a = await (Ft(r) ? r : Promise.resolve(r));
    return ks(n, a);
  }
  refine(e, t) {
    const n = (r) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(r) : t;
    return this._refinement((r, a) => {
      const i = e(r), o = () => a.addIssue({
        code: h.custom,
        ...n(r)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((c) => c ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((n, r) => e(n) ? !0 : (r.addIssue(typeof t == "function" ? t(n, r) : t), !1));
  }
  _refinement(e) {
    return new qe({
      schema: this,
      typeName: R.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (t) => this["~validate"](t)
    };
  }
  optional() {
    return xe.create(this, this._def);
  }
  nullable() {
    return He.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return he.create(this);
  }
  promise() {
    return Lt.create(this, this._def);
  }
  or(e) {
    return Mt.create([this, e], this._def);
  }
  and(e) {
    return Dt.create(this, e, this._def);
  }
  transform(e) {
    return new qe({
      ...T(this._def),
      schema: this,
      typeName: R.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new wn({
      ...T(this._def),
      innerType: this,
      defaultValue: t,
      typeName: R.ZodDefault
    });
  }
  brand() {
    return new di({
      typeName: R.ZodBranded,
      type: this,
      ...T(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new bn({
      ...T(this._def),
      innerType: this,
      catchValue: t,
      typeName: R.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return Dn.create(this, e);
  }
  readonly() {
    return xn.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Va = /^c[^\s-]{8,}$/i, Za = /^[0-9a-z]+$/, Ja = /^[0-9A-HJKMNP-TV-Z]{26}$/i, za = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, qa = /^[a-z0-9_-]{21}$/i, Ha = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Xa = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Ga = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Qa = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let sn;
const Ya = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Ka = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, ei = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, ti = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, ni = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, si = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, fr = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", ri = new RegExp(`^${fr}$`);
function mr(s) {
  let e = "[0-5]\\d";
  s.precision ? e = `${e}\\.\\d{${s.precision}}` : s.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = s.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function ai(s) {
  return new RegExp(`^${mr(s)}$`);
}
function ii(s) {
  let e = `${fr}T${mr(s)}`;
  const t = [];
  return t.push(s.local ? "Z?" : "Z"), s.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function oi(s, e) {
  return !!((e === "v4" || !e) && Ya.test(s) || (e === "v6" || !e) && ei.test(s));
}
function ci(s, e) {
  if (!Ha.test(s))
    return !1;
  try {
    const [t] = s.split(".");
    if (!t)
      return !1;
    const n = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), r = JSON.parse(atob(n));
    return !(typeof r != "object" || r === null || "typ" in r && (r == null ? void 0 : r.typ) !== "JWT" || !r.alg || e && r.alg !== e);
  } catch {
    return !1;
  }
}
function li(s, e) {
  return !!((e === "v4" || !e) && Ka.test(s) || (e === "v6" || !e) && ti.test(s));
}
class be extends F {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== w.string) {
      const a = this._getOrReturnCtx(e);
      return _(a, {
        code: h.invalid_type,
        expected: w.string,
        received: a.parsedType
      }), P;
    }
    const n = new ne();
    let r;
    for (const a of this._def.checks)
      if (a.kind === "min")
        e.data.length < a.value && (r = this._getOrReturnCtx(e, r), _(r, {
          code: h.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), n.dirty());
      else if (a.kind === "max")
        e.data.length > a.value && (r = this._getOrReturnCtx(e, r), _(r, {
          code: h.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), n.dirty());
      else if (a.kind === "length") {
        const i = e.data.length > a.value, o = e.data.length < a.value;
        (i || o) && (r = this._getOrReturnCtx(e, r), i ? _(r, {
          code: h.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }) : o && _(r, {
          code: h.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }), n.dirty());
      } else if (a.kind === "email")
        Ga.test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
          validation: "email",
          code: h.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "emoji")
        sn || (sn = new RegExp(Qa, "u")), sn.test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
          validation: "emoji",
          code: h.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "uuid")
        za.test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
          validation: "uuid",
          code: h.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "nanoid")
        qa.test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
          validation: "nanoid",
          code: h.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "cuid")
        Va.test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
          validation: "cuid",
          code: h.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "cuid2")
        Za.test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
          validation: "cuid2",
          code: h.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "ulid")
        Ja.test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
          validation: "ulid",
          code: h.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "url")
        try {
          new URL(e.data);
        } catch {
          r = this._getOrReturnCtx(e, r), _(r, {
            validation: "url",
            code: h.invalid_string,
            message: a.message
          }), n.dirty();
        }
      else a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
        validation: "regex",
        code: h.invalid_string,
        message: a.message
      }), n.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (r = this._getOrReturnCtx(e, r), _(r, {
        code: h.invalid_string,
        validation: { includes: a.value, position: a.position },
        message: a.message
      }), n.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (r = this._getOrReturnCtx(e, r), _(r, {
        code: h.invalid_string,
        validation: { startsWith: a.value },
        message: a.message
      }), n.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (r = this._getOrReturnCtx(e, r), _(r, {
        code: h.invalid_string,
        validation: { endsWith: a.value },
        message: a.message
      }), n.dirty()) : a.kind === "datetime" ? ii(a).test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
        code: h.invalid_string,
        validation: "datetime",
        message: a.message
      }), n.dirty()) : a.kind === "date" ? ri.test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
        code: h.invalid_string,
        validation: "date",
        message: a.message
      }), n.dirty()) : a.kind === "time" ? ai(a).test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
        code: h.invalid_string,
        validation: "time",
        message: a.message
      }), n.dirty()) : a.kind === "duration" ? Xa.test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
        validation: "duration",
        code: h.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "ip" ? oi(e.data, a.version) || (r = this._getOrReturnCtx(e, r), _(r, {
        validation: "ip",
        code: h.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "jwt" ? ci(e.data, a.alg) || (r = this._getOrReturnCtx(e, r), _(r, {
        validation: "jwt",
        code: h.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "cidr" ? li(e.data, a.version) || (r = this._getOrReturnCtx(e, r), _(r, {
        validation: "cidr",
        code: h.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "base64" ? ni.test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
        validation: "base64",
        code: h.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "base64url" ? si.test(e.data) || (r = this._getOrReturnCtx(e, r), _(r, {
        validation: "base64url",
        code: h.invalid_string,
        message: a.message
      }), n.dirty()) : N.assertNever(a);
    return { status: n.value, value: e.data };
  }
  _regex(e, t, n) {
    return this.refinement((r) => e.test(r), {
      validation: t,
      code: h.invalid_string,
      ...b.errToObj(n)
    });
  }
  _addCheck(e) {
    return new be({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...b.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...b.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...b.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...b.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...b.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...b.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...b.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...b.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...b.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...b.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...b.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...b.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...b.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (e == null ? void 0 : e.offset) ?? !1,
      local: (e == null ? void 0 : e.local) ?? !1,
      ...b.errToObj(e == null ? void 0 : e.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      ...b.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...b.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...b.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...b.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...b.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...b.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...b.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...b.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...b.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, b.errToObj(e));
  }
  trim() {
    return new be({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new be({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new be({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
be.create = (s) => new be({
  checks: [],
  typeName: R.ZodString,
  coerce: (s == null ? void 0 : s.coerce) ?? !1,
  ...T(s)
});
function ui(s, e) {
  const t = (s.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, r = t > n ? t : n, a = Number.parseInt(s.toFixed(r).replace(".", "")), i = Number.parseInt(e.toFixed(r).replace(".", ""));
  return a % i / 10 ** r;
}
class Je extends F {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== w.number) {
      const a = this._getOrReturnCtx(e);
      return _(a, {
        code: h.invalid_type,
        expected: w.number,
        received: a.parsedType
      }), P;
    }
    let n;
    const r = new ne();
    for (const a of this._def.checks)
      a.kind === "int" ? N.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
        code: h.invalid_type,
        expected: "integer",
        received: "float",
        message: a.message
      }), r.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (n = this._getOrReturnCtx(e, n), _(n, {
        code: h.too_small,
        minimum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), r.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (n = this._getOrReturnCtx(e, n), _(n, {
        code: h.too_big,
        maximum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), r.dirty()) : a.kind === "multipleOf" ? ui(e.data, a.value) !== 0 && (n = this._getOrReturnCtx(e, n), _(n, {
        code: h.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), r.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), _(n, {
        code: h.not_finite,
        message: a.message
      }), r.dirty()) : N.assertNever(a);
    return { status: r.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, b.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, b.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, b.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, b.toString(t));
  }
  setLimit(e, t, n, r) {
    return new Je({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: b.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Je({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: b.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: b.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: b.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: b.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: b.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: b.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: b.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: b.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: b.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && N.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf")
        return !0;
      n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
Je.create = (s) => new Je({
  checks: [],
  typeName: R.ZodNumber,
  coerce: (s == null ? void 0 : s.coerce) || !1,
  ...T(s)
});
class ct extends F {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== w.bigint)
      return this._getInvalidInput(e);
    let n;
    const r = new ne();
    for (const a of this._def.checks)
      a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (n = this._getOrReturnCtx(e, n), _(n, {
        code: h.too_small,
        type: "bigint",
        minimum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), r.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (n = this._getOrReturnCtx(e, n), _(n, {
        code: h.too_big,
        type: "bigint",
        maximum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), r.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), _(n, {
        code: h.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), r.dirty()) : N.assertNever(a);
    return { status: r.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return _(t, {
      code: h.invalid_type,
      expected: w.bigint,
      received: t.parsedType
    }), P;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, b.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, b.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, b.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, b.toString(t));
  }
  setLimit(e, t, n, r) {
    return new ct({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: b.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new ct({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: b.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: b.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: b.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: b.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: b.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
ct.create = (s) => new ct({
  checks: [],
  typeName: R.ZodBigInt,
  coerce: (s == null ? void 0 : s.coerce) ?? !1,
  ...T(s)
});
class _n extends F {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== w.boolean) {
      const n = this._getOrReturnCtx(e);
      return _(n, {
        code: h.invalid_type,
        expected: w.boolean,
        received: n.parsedType
      }), P;
    }
    return re(e.data);
  }
}
_n.create = (s) => new _n({
  typeName: R.ZodBoolean,
  coerce: (s == null ? void 0 : s.coerce) || !1,
  ...T(s)
});
class Nt extends F {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== w.date) {
      const a = this._getOrReturnCtx(e);
      return _(a, {
        code: h.invalid_type,
        expected: w.date,
        received: a.parsedType
      }), P;
    }
    if (Number.isNaN(e.data.getTime())) {
      const a = this._getOrReturnCtx(e);
      return _(a, {
        code: h.invalid_date
      }), P;
    }
    const n = new ne();
    let r;
    for (const a of this._def.checks)
      a.kind === "min" ? e.data.getTime() < a.value && (r = this._getOrReturnCtx(e, r), _(r, {
        code: h.too_small,
        message: a.message,
        inclusive: !0,
        exact: !1,
        minimum: a.value,
        type: "date"
      }), n.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (r = this._getOrReturnCtx(e, r), _(r, {
        code: h.too_big,
        message: a.message,
        inclusive: !0,
        exact: !1,
        maximum: a.value,
        type: "date"
      }), n.dirty()) : N.assertNever(a);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new Nt({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: b.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: b.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
Nt.create = (s) => new Nt({
  checks: [],
  coerce: (s == null ? void 0 : s.coerce) || !1,
  typeName: R.ZodDate,
  ...T(s)
});
class Cs extends F {
  _parse(e) {
    if (this._getType(e) !== w.symbol) {
      const n = this._getOrReturnCtx(e);
      return _(n, {
        code: h.invalid_type,
        expected: w.symbol,
        received: n.parsedType
      }), P;
    }
    return re(e.data);
  }
}
Cs.create = (s) => new Cs({
  typeName: R.ZodSymbol,
  ...T(s)
});
class Ps extends F {
  _parse(e) {
    if (this._getType(e) !== w.undefined) {
      const n = this._getOrReturnCtx(e);
      return _(n, {
        code: h.invalid_type,
        expected: w.undefined,
        received: n.parsedType
      }), P;
    }
    return re(e.data);
  }
}
Ps.create = (s) => new Ps({
  typeName: R.ZodUndefined,
  ...T(s)
});
class Rs extends F {
  _parse(e) {
    if (this._getType(e) !== w.null) {
      const n = this._getOrReturnCtx(e);
      return _(n, {
        code: h.invalid_type,
        expected: w.null,
        received: n.parsedType
      }), P;
    }
    return re(e.data);
  }
}
Rs.create = (s) => new Rs({
  typeName: R.ZodNull,
  ...T(s)
});
class Is extends F {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return re(e.data);
  }
}
Is.create = (s) => new Is({
  typeName: R.ZodAny,
  ...T(s)
});
class Es extends F {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return re(e.data);
  }
}
Es.create = (s) => new Es({
  typeName: R.ZodUnknown,
  ...T(s)
});
class Ae extends F {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return _(t, {
      code: h.invalid_type,
      expected: w.never,
      received: t.parsedType
    }), P;
  }
}
Ae.create = (s) => new Ae({
  typeName: R.ZodNever,
  ...T(s)
});
class $s extends F {
  _parse(e) {
    if (this._getType(e) !== w.undefined) {
      const n = this._getOrReturnCtx(e);
      return _(n, {
        code: h.invalid_type,
        expected: w.void,
        received: n.parsedType
      }), P;
    }
    return re(e.data);
  }
}
$s.create = (s) => new $s({
  typeName: R.ZodVoid,
  ...T(s)
});
class he extends F {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), r = this._def;
    if (t.parsedType !== w.array)
      return _(t, {
        code: h.invalid_type,
        expected: w.array,
        received: t.parsedType
      }), P;
    if (r.exactLength !== null) {
      const i = t.data.length > r.exactLength.value, o = t.data.length < r.exactLength.value;
      (i || o) && (_(t, {
        code: i ? h.too_big : h.too_small,
        minimum: o ? r.exactLength.value : void 0,
        maximum: i ? r.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: r.exactLength.message
      }), n.dirty());
    }
    if (r.minLength !== null && t.data.length < r.minLength.value && (_(t, {
      code: h.too_small,
      minimum: r.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.minLength.message
    }), n.dirty()), r.maxLength !== null && t.data.length > r.maxLength.value && (_(t, {
      code: h.too_big,
      maximum: r.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.maxLength.message
    }), n.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => r.type._parseAsync(new Se(t, i, t.path, o)))).then((i) => ne.mergeArray(n, i));
    const a = [...t.data].map((i, o) => r.type._parseSync(new Se(t, i, t.path, o)));
    return ne.mergeArray(n, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new he({
      ...this._def,
      minLength: { value: e, message: b.toString(t) }
    });
  }
  max(e, t) {
    return new he({
      ...this._def,
      maxLength: { value: e, message: b.toString(t) }
    });
  }
  length(e, t) {
    return new he({
      ...this._def,
      exactLength: { value: e, message: b.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
he.create = (s, e) => new he({
  type: s,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: R.ZodArray,
  ...T(e)
});
function Le(s) {
  if (s instanceof V) {
    const e = {};
    for (const t in s.shape) {
      const n = s.shape[t];
      e[t] = xe.create(Le(n));
    }
    return new V({
      ...s._def,
      shape: () => e
    });
  } else return s instanceof he ? new he({
    ...s._def,
    type: Le(s.element)
  }) : s instanceof xe ? xe.create(Le(s.unwrap())) : s instanceof He ? He.create(Le(s.unwrap())) : s instanceof $e ? $e.create(s.items.map((e) => Le(e))) : s;
}
class V extends F {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = N.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== w.object) {
      const l = this._getOrReturnCtx(e);
      return _(l, {
        code: h.invalid_type,
        expected: w.object,
        received: l.parsedType
      }), P;
    }
    const { status: n, ctx: r } = this._processInputParams(e), { shape: a, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof Ae && this._def.unknownKeys === "strip"))
      for (const l in r.data)
        i.includes(l) || o.push(l);
    const c = [];
    for (const l of i) {
      const d = a[l], u = r.data[l];
      c.push({
        key: { status: "valid", value: l },
        value: d._parse(new Se(r, u, r.path, l)),
        alwaysSet: l in r.data
      });
    }
    if (this._def.catchall instanceof Ae) {
      const l = this._def.unknownKeys;
      if (l === "passthrough")
        for (const d of o)
          c.push({
            key: { status: "valid", value: d },
            value: { status: "valid", value: r.data[d] }
          });
      else if (l === "strict")
        o.length > 0 && (_(r, {
          code: h.unrecognized_keys,
          keys: o
        }), n.dirty());
      else if (l !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const l = this._def.catchall;
      for (const d of o) {
        const u = r.data[d];
        c.push({
          key: { status: "valid", value: d },
          value: l._parse(
            new Se(r, u, r.path, d)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: d in r.data
        });
      }
    }
    return r.common.async ? Promise.resolve().then(async () => {
      const l = [];
      for (const d of c) {
        const u = await d.key, f = await d.value;
        l.push({
          key: u,
          value: f,
          alwaysSet: d.alwaysSet
        });
      }
      return l;
    }).then((l) => ne.mergeObjectSync(n, l)) : ne.mergeObjectSync(n, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return b.errToObj, new V({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, n) => {
          var a, i;
          const r = ((i = (a = this._def).errorMap) == null ? void 0 : i.call(a, t, n).message) ?? n.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: b.errToObj(e).message ?? r
          } : {
            message: r
          };
        }
      } : {}
    });
  }
  strip() {
    return new V({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new V({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new V({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new V({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: R.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new V({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const n of N.objectKeys(e))
      e[n] && this.shape[n] && (t[n] = this.shape[n]);
    return new V({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const n of N.objectKeys(this.shape))
      e[n] || (t[n] = this.shape[n]);
    return new V({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return Le(this);
  }
  partial(e) {
    const t = {};
    for (const n of N.objectKeys(this.shape)) {
      const r = this.shape[n];
      e && !e[n] ? t[n] = r : t[n] = r.optional();
    }
    return new V({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const n of N.objectKeys(this.shape))
      if (e && !e[n])
        t[n] = this.shape[n];
      else {
        let a = this.shape[n];
        for (; a instanceof xe; )
          a = a._def.innerType;
        t[n] = a;
      }
    return new V({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return pr(N.objectKeys(this.shape));
  }
}
V.create = (s, e) => new V({
  shape: () => s,
  unknownKeys: "strip",
  catchall: Ae.create(),
  typeName: R.ZodObject,
  ...T(e)
});
V.strictCreate = (s, e) => new V({
  shape: () => s,
  unknownKeys: "strict",
  catchall: Ae.create(),
  typeName: R.ZodObject,
  ...T(e)
});
V.lazycreate = (s, e) => new V({
  shape: s,
  unknownKeys: "strip",
  catchall: Ae.create(),
  typeName: R.ZodObject,
  ...T(e)
});
class Mt extends F {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = this._def.options;
    function r(a) {
      for (const o of a)
        if (o.result.status === "valid")
          return o.result;
      for (const o of a)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = a.map((o) => new pe(o.ctx.common.issues));
      return _(t, {
        code: h.invalid_union,
        unionErrors: i
      }), P;
    }
    if (t.common.async)
      return Promise.all(n.map(async (a) => {
        const i = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await a._parseAsync({
            data: t.data,
            path: t.path,
            parent: i
          }),
          ctx: i
        };
      })).then(r);
    {
      let a;
      const i = [];
      for (const c of n) {
        const l = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, d = c._parseSync({
          data: t.data,
          path: t.path,
          parent: l
        });
        if (d.status === "valid")
          return d;
        d.status === "dirty" && !a && (a = { result: d, ctx: l }), l.common.issues.length && i.push(l.common.issues);
      }
      if (a)
        return t.common.issues.push(...a.ctx.common.issues), a.result;
      const o = i.map((c) => new pe(c));
      return _(t, {
        code: h.invalid_union,
        unionErrors: o
      }), P;
    }
  }
  get options() {
    return this._def.options;
  }
}
Mt.create = (s, e) => new Mt({
  options: s,
  typeName: R.ZodUnion,
  ...T(e)
});
function yn(s, e) {
  const t = we(s), n = we(e);
  if (s === e)
    return { valid: !0, data: s };
  if (t === w.object && n === w.object) {
    const r = N.objectKeys(e), a = N.objectKeys(s).filter((o) => r.indexOf(o) !== -1), i = { ...s, ...e };
    for (const o of a) {
      const c = yn(s[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      i[o] = c.data;
    }
    return { valid: !0, data: i };
  } else if (t === w.array && n === w.array) {
    if (s.length !== e.length)
      return { valid: !1 };
    const r = [];
    for (let a = 0; a < s.length; a++) {
      const i = s[a], o = e[a], c = yn(i, o);
      if (!c.valid)
        return { valid: !1 };
      r.push(c.data);
    }
    return { valid: !0, data: r };
  } else return t === w.date && n === w.date && +s == +e ? { valid: !0, data: s } : { valid: !1 };
}
class Dt extends F {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), r = (a, i) => {
      if (Ss(a) || Ss(i))
        return P;
      const o = yn(a.value, i.value);
      return o.valid ? ((As(a) || As(i)) && t.dirty(), { status: t.value, value: o.data }) : (_(n, {
        code: h.invalid_intersection_types
      }), P);
    };
    return n.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      }),
      this._def.right._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      })
    ]).then(([a, i]) => r(a, i)) : r(this._def.left._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }), this._def.right._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }));
  }
}
Dt.create = (s, e, t) => new Dt({
  left: s,
  right: e,
  typeName: R.ZodIntersection,
  ...T(t)
});
class $e extends F {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== w.array)
      return _(n, {
        code: h.invalid_type,
        expected: w.array,
        received: n.parsedType
      }), P;
    if (n.data.length < this._def.items.length)
      return _(n, {
        code: h.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), P;
    !this._def.rest && n.data.length > this._def.items.length && (_(n, {
      code: h.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const a = [...n.data].map((i, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new Se(n, i, n.path, o)) : null;
    }).filter((i) => !!i);
    return n.common.async ? Promise.all(a).then((i) => ne.mergeArray(t, i)) : ne.mergeArray(t, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new $e({
      ...this._def,
      rest: e
    });
  }
}
$e.create = (s, e) => {
  if (!Array.isArray(s))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new $e({
    items: s,
    typeName: R.ZodTuple,
    rest: null,
    ...T(e)
  });
};
class Ts extends F {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== w.map)
      return _(n, {
        code: h.invalid_type,
        expected: w.map,
        received: n.parsedType
      }), P;
    const r = this._def.keyType, a = this._def.valueType, i = [...n.data.entries()].map(([o, c], l) => ({
      key: r._parse(new Se(n, o, n.path, [l, "key"])),
      value: a._parse(new Se(n, c, n.path, [l, "value"]))
    }));
    if (n.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of i) {
          const l = await c.key, d = await c.value;
          if (l.status === "aborted" || d.status === "aborted")
            return P;
          (l.status === "dirty" || d.status === "dirty") && t.dirty(), o.set(l.value, d.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const c of i) {
        const l = c.key, d = c.value;
        if (l.status === "aborted" || d.status === "aborted")
          return P;
        (l.status === "dirty" || d.status === "dirty") && t.dirty(), o.set(l.value, d.value);
      }
      return { status: t.value, value: o };
    }
  }
}
Ts.create = (s, e, t) => new Ts({
  valueType: e,
  keyType: s,
  typeName: R.ZodMap,
  ...T(t)
});
class lt extends F {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== w.set)
      return _(n, {
        code: h.invalid_type,
        expected: w.set,
        received: n.parsedType
      }), P;
    const r = this._def;
    r.minSize !== null && n.data.size < r.minSize.value && (_(n, {
      code: h.too_small,
      minimum: r.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.minSize.message
    }), t.dirty()), r.maxSize !== null && n.data.size > r.maxSize.value && (_(n, {
      code: h.too_big,
      maximum: r.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.maxSize.message
    }), t.dirty());
    const a = this._def.valueType;
    function i(c) {
      const l = /* @__PURE__ */ new Set();
      for (const d of c) {
        if (d.status === "aborted")
          return P;
        d.status === "dirty" && t.dirty(), l.add(d.value);
      }
      return { status: t.value, value: l };
    }
    const o = [...n.data.values()].map((c, l) => a._parse(new Se(n, c, n.path, l)));
    return n.common.async ? Promise.all(o).then((c) => i(c)) : i(o);
  }
  min(e, t) {
    return new lt({
      ...this._def,
      minSize: { value: e, message: b.toString(t) }
    });
  }
  max(e, t) {
    return new lt({
      ...this._def,
      maxSize: { value: e, message: b.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
lt.create = (s, e) => new lt({
  valueType: s,
  minSize: null,
  maxSize: null,
  typeName: R.ZodSet,
  ...T(e)
});
class Os extends F {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
Os.create = (s, e) => new Os({
  getter: s,
  typeName: R.ZodLazy,
  ...T(e)
});
class Fs extends F {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return _(t, {
        received: t.data,
        code: h.invalid_literal,
        expected: this._def.value
      }), P;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Fs.create = (s, e) => new Fs({
  value: s,
  typeName: R.ZodLiteral,
  ...T(e)
});
function pr(s, e) {
  return new ze({
    values: s,
    typeName: R.ZodEnum,
    ...T(e)
  });
}
class ze extends F {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return _(t, {
        expected: N.joinValues(n),
        received: t.parsedType,
        code: h.invalid_type
      }), P;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return _(t, {
        received: t.data,
        code: h.invalid_enum_value,
        options: n
      }), P;
    }
    return re(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return ze.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return ze.create(this.options.filter((n) => !e.includes(n)), {
      ...this._def,
      ...t
    });
  }
}
ze.create = pr;
class Ns extends F {
  _parse(e) {
    const t = N.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== w.string && n.parsedType !== w.number) {
      const r = N.objectValues(t);
      return _(n, {
        expected: N.joinValues(r),
        received: n.parsedType,
        code: h.invalid_type
      }), P;
    }
    if (this._cache || (this._cache = new Set(N.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const r = N.objectValues(t);
      return _(n, {
        received: n.data,
        code: h.invalid_enum_value,
        options: r
      }), P;
    }
    return re(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Ns.create = (s, e) => new Ns({
  values: s,
  typeName: R.ZodNativeEnum,
  ...T(e)
});
class Lt extends F {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== w.promise && t.common.async === !1)
      return _(t, {
        code: h.invalid_type,
        expected: w.promise,
        received: t.parsedType
      }), P;
    const n = t.parsedType === w.promise ? t.data : Promise.resolve(t.data);
    return re(n.then((r) => this._def.type.parseAsync(r, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
Lt.create = (s, e) => new Lt({
  type: s,
  typeName: R.ZodPromise,
  ...T(e)
});
class qe extends F {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === R.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), r = this._def.effect || null, a = {
      addIssue: (i) => {
        _(n, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (a.addIssue = a.addIssue.bind(a), r.type === "preprocess") {
      const i = r.transform(n.data, a);
      if (n.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return P;
          const c = await this._def.schema._parseAsync({
            data: o,
            path: n.path,
            parent: n
          });
          return c.status === "aborted" ? P : c.status === "dirty" || t.value === "dirty" ? Ye(c.value) : c;
        });
      {
        if (t.value === "aborted")
          return P;
        const o = this._def.schema._parseSync({
          data: i,
          path: n.path,
          parent: n
        });
        return o.status === "aborted" ? P : o.status === "dirty" || t.value === "dirty" ? Ye(o.value) : o;
      }
    }
    if (r.type === "refinement") {
      const i = (o) => {
        const c = r.refinement(o, a);
        if (n.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return o.status === "aborted" ? P : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => o.status === "aborted" ? P : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (r.type === "transform")
      if (n.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!Ze(i))
          return P;
        const o = r.transform(i.value, a);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((i) => Ze(i) ? Promise.resolve(r.transform(i.value, a)).then((o) => ({
          status: t.value,
          value: o
        })) : P);
    N.assertNever(r);
  }
}
qe.create = (s, e, t) => new qe({
  schema: s,
  typeName: R.ZodEffects,
  effect: e,
  ...T(t)
});
qe.createWithPreprocess = (s, e, t) => new qe({
  schema: e,
  effect: { type: "preprocess", transform: s },
  typeName: R.ZodEffects,
  ...T(t)
});
class xe extends F {
  _parse(e) {
    return this._getType(e) === w.undefined ? re(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
xe.create = (s, e) => new xe({
  innerType: s,
  typeName: R.ZodOptional,
  ...T(e)
});
class He extends F {
  _parse(e) {
    return this._getType(e) === w.null ? re(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
He.create = (s, e) => new He({
  innerType: s,
  typeName: R.ZodNullable,
  ...T(e)
});
class wn extends F {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === w.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
wn.create = (s, e) => new wn({
  innerType: s,
  typeName: R.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...T(e)
});
class bn extends F {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, r = this._def.innerType._parse({
      data: n.data,
      path: n.path,
      parent: {
        ...n
      }
    });
    return Ft(r) ? r.then((a) => ({
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new pe(n.common.issues);
        },
        input: n.data
      })
    })) : {
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new pe(n.common.issues);
        },
        input: n.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
bn.create = (s, e) => new bn({
  innerType: s,
  typeName: R.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...T(e)
});
class Ms extends F {
  _parse(e) {
    if (this._getType(e) !== w.nan) {
      const n = this._getOrReturnCtx(e);
      return _(n, {
        code: h.invalid_type,
        expected: w.nan,
        received: n.parsedType
      }), P;
    }
    return { status: "valid", value: e.data };
  }
}
Ms.create = (s) => new Ms({
  typeName: R.ZodNaN,
  ...T(s)
});
class di extends F {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = t.data;
    return this._def.type._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Dn extends F {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const a = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return a.status === "aborted" ? P : a.status === "dirty" ? (t.dirty(), Ye(a.value)) : this._def.out._parseAsync({
          data: a.value,
          path: n.path,
          parent: n
        });
      })();
    {
      const r = this._def.in._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return r.status === "aborted" ? P : r.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: r.value
      }) : this._def.out._parseSync({
        data: r.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, t) {
    return new Dn({
      in: e,
      out: t,
      typeName: R.ZodPipeline
    });
  }
}
class xn extends F {
  _parse(e) {
    const t = this._def.innerType._parse(e), n = (r) => (Ze(r) && (r.value = Object.freeze(r.value)), r);
    return Ft(t) ? t.then((r) => n(r)) : n(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
xn.create = (s, e) => new xn({
  innerType: s,
  typeName: R.ZodReadonly,
  ...T(e)
});
var R;
(function(s) {
  s.ZodString = "ZodString", s.ZodNumber = "ZodNumber", s.ZodNaN = "ZodNaN", s.ZodBigInt = "ZodBigInt", s.ZodBoolean = "ZodBoolean", s.ZodDate = "ZodDate", s.ZodSymbol = "ZodSymbol", s.ZodUndefined = "ZodUndefined", s.ZodNull = "ZodNull", s.ZodAny = "ZodAny", s.ZodUnknown = "ZodUnknown", s.ZodNever = "ZodNever", s.ZodVoid = "ZodVoid", s.ZodArray = "ZodArray", s.ZodObject = "ZodObject", s.ZodUnion = "ZodUnion", s.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", s.ZodIntersection = "ZodIntersection", s.ZodTuple = "ZodTuple", s.ZodRecord = "ZodRecord", s.ZodMap = "ZodMap", s.ZodSet = "ZodSet", s.ZodFunction = "ZodFunction", s.ZodLazy = "ZodLazy", s.ZodLiteral = "ZodLiteral", s.ZodEnum = "ZodEnum", s.ZodEffects = "ZodEffects", s.ZodNativeEnum = "ZodNativeEnum", s.ZodOptional = "ZodOptional", s.ZodNullable = "ZodNullable", s.ZodDefault = "ZodDefault", s.ZodCatch = "ZodCatch", s.ZodPromise = "ZodPromise", s.ZodBranded = "ZodBranded", s.ZodPipeline = "ZodPipeline", s.ZodReadonly = "ZodReadonly";
})(R || (R = {}));
const Ds = be.create, hi = Je.create, fi = _n.create;
Ae.create;
const Ls = he.create, rn = V.create;
Mt.create;
Dt.create;
$e.create;
ze.create;
Lt.create;
xe.create;
He.create;
const vn = "RFC3986", Sn = {
  RFC1738: (s) => String(s).replace(/%20/g, "+"),
  RFC3986: (s) => String(s)
}, mi = "RFC1738", pi = Array.isArray, ce = (() => {
  const s = [];
  for (let e = 0; e < 256; ++e)
    s.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return s;
})(), an = 1024, gi = (s, e, t, n, r) => {
  if (s.length === 0)
    return s;
  let a = s;
  if (typeof s == "symbol" ? a = Symbol.prototype.toString.call(s) : typeof s != "string" && (a = String(s)), t === "iso-8859-1")
    return escape(a).replace(/%u[0-9a-f]{4}/gi, function(o) {
      return "%26%23" + parseInt(o.slice(2), 16) + "%3B";
    });
  let i = "";
  for (let o = 0; o < a.length; o += an) {
    const c = a.length >= an ? a.slice(o, o + an) : a, l = [];
    for (let d = 0; d < c.length; ++d) {
      let u = c.charCodeAt(d);
      if (u === 45 || // -
      u === 46 || // .
      u === 95 || // _
      u === 126 || // ~
      u >= 48 && u <= 57 || // 0-9
      u >= 65 && u <= 90 || // a-z
      u >= 97 && u <= 122 || // A-Z
      r === mi && (u === 40 || u === 41)) {
        l[l.length] = c.charAt(d);
        continue;
      }
      if (u < 128) {
        l[l.length] = ce[u];
        continue;
      }
      if (u < 2048) {
        l[l.length] = ce[192 | u >> 6] + ce[128 | u & 63];
        continue;
      }
      if (u < 55296 || u >= 57344) {
        l[l.length] = ce[224 | u >> 12] + ce[128 | u >> 6 & 63] + ce[128 | u & 63];
        continue;
      }
      d += 1, u = 65536 + ((u & 1023) << 10 | c.charCodeAt(d) & 1023), l[l.length] = ce[240 | u >> 18] + ce[128 | u >> 12 & 63] + ce[128 | u >> 6 & 63] + ce[128 | u & 63];
    }
    i += l.join("");
  }
  return i;
};
function _i(s) {
  return !s || typeof s != "object" ? !1 : !!(s.constructor && s.constructor.isBuffer && s.constructor.isBuffer(s));
}
function Bs(s, e) {
  if (pi(s)) {
    const t = [];
    for (let n = 0; n < s.length; n += 1)
      t.push(e(s[n]));
    return t;
  }
  return e(s);
}
const yi = Object.prototype.hasOwnProperty, gr = {
  brackets(s) {
    return String(s) + "[]";
  },
  comma: "comma",
  indices(s, e) {
    return String(s) + "[" + e + "]";
  },
  repeat(s) {
    return String(s);
  }
}, le = Array.isArray, wi = Array.prototype.push, _r = function(s, e) {
  wi.apply(s, le(e) ? e : [e]);
}, bi = Date.prototype.toISOString, J = {
  addQueryPrefix: !1,
  allowDots: !1,
  allowEmptyArrays: !1,
  arrayFormat: "indices",
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encodeDotInKeys: !1,
  encoder: gi,
  encodeValuesOnly: !1,
  format: vn,
  formatter: Sn[vn],
  /** @deprecated */
  indices: !1,
  serializeDate(s) {
    return bi.call(s);
  },
  skipNulls: !1,
  strictNullHandling: !1
};
function xi(s) {
  return typeof s == "string" || typeof s == "number" || typeof s == "boolean" || typeof s == "symbol" || typeof s == "bigint";
}
const on = {};
function yr(s, e, t, n, r, a, i, o, c, l, d, u, f, g, x, y, p, E) {
  let m = s, k = E, S = 0, D = !1;
  for (; (k = k.get(on)) !== void 0 && !D; ) {
    const B = k.get(s);
    if (S += 1, typeof B < "u") {
      if (B === S)
        throw new RangeError("Cyclic object value");
      D = !0;
    }
    typeof k.get(on) > "u" && (S = 0);
  }
  if (typeof l == "function" ? m = l(e, m) : m instanceof Date ? m = f == null ? void 0 : f(m) : t === "comma" && le(m) && (m = Bs(m, function(B) {
    return B instanceof Date ? f == null ? void 0 : f(B) : B;
  })), m === null) {
    if (a)
      return c && !y ? (
        // @ts-expect-error
        c(e, J.encoder, p, "key", g)
      ) : e;
    m = "";
  }
  if (xi(m) || _i(m)) {
    if (c) {
      const B = y ? e : c(e, J.encoder, p, "key", g);
      return [
        (x == null ? void 0 : x(B)) + "=" + // @ts-expect-error
        (x == null ? void 0 : x(c(m, J.encoder, p, "value", g)))
      ];
    }
    return [(x == null ? void 0 : x(e)) + "=" + (x == null ? void 0 : x(String(m)))];
  }
  const O = [];
  if (typeof m > "u")
    return O;
  let $;
  if (t === "comma" && le(m))
    y && c && (m = Bs(m, c)), $ = [{ value: m.length > 0 ? m.join(",") || null : void 0 }];
  else if (le(l))
    $ = l;
  else {
    const B = Object.keys(m);
    $ = d ? B.sort(d) : B;
  }
  const q = o ? String(e).replace(/\./g, "%2E") : String(e), j = n && le(m) && m.length === 1 ? q + "[]" : q;
  if (r && le(m) && m.length === 0)
    return j + "[]";
  for (let B = 0; B < $.length; ++B) {
    const L = $[B], Oe = (
      // @ts-ignore
      typeof L == "object" && typeof L.value < "u" ? L.value : m[L]
    );
    if (i && Oe === null)
      continue;
    const nn = u && o ? L.replace(/\./g, "%2E") : L, Na = le(m) ? typeof t == "function" ? t(j, nn) : j : j + (u ? "." + nn : "[" + nn + "]");
    E.set(s, S);
    const xs = /* @__PURE__ */ new WeakMap();
    xs.set(on, E), _r(O, yr(
      Oe,
      Na,
      t,
      n,
      r,
      a,
      i,
      o,
      // @ts-ignore
      t === "comma" && y && le(m) ? null : c,
      l,
      d,
      u,
      f,
      g,
      x,
      y,
      p,
      xs
    ));
  }
  return O;
}
function vi(s = J) {
  if (typeof s.allowEmptyArrays < "u" && typeof s.allowEmptyArrays != "boolean")
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  if (typeof s.encodeDotInKeys < "u" && typeof s.encodeDotInKeys != "boolean")
    throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
  if (s.encoder !== null && typeof s.encoder < "u" && typeof s.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  const e = s.charset || J.charset;
  if (typeof s.charset < "u" && s.charset !== "utf-8" && s.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  let t = vn;
  if (typeof s.format < "u") {
    if (!yi.call(Sn, s.format))
      throw new TypeError("Unknown format option provided.");
    t = s.format;
  }
  const n = Sn[t];
  let r = J.filter;
  (typeof s.filter == "function" || le(s.filter)) && (r = s.filter);
  let a;
  if (s.arrayFormat && s.arrayFormat in gr ? a = s.arrayFormat : "indices" in s ? a = s.indices ? "indices" : "repeat" : a = J.arrayFormat, "commaRoundTrip" in s && typeof s.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  const i = typeof s.allowDots > "u" ? s.encodeDotInKeys ? !0 : J.allowDots : !!s.allowDots;
  return {
    addQueryPrefix: typeof s.addQueryPrefix == "boolean" ? s.addQueryPrefix : J.addQueryPrefix,
    // @ts-ignore
    allowDots: i,
    allowEmptyArrays: typeof s.allowEmptyArrays == "boolean" ? !!s.allowEmptyArrays : J.allowEmptyArrays,
    arrayFormat: a,
    charset: e,
    charsetSentinel: typeof s.charsetSentinel == "boolean" ? s.charsetSentinel : J.charsetSentinel,
    commaRoundTrip: !!s.commaRoundTrip,
    delimiter: typeof s.delimiter > "u" ? J.delimiter : s.delimiter,
    encode: typeof s.encode == "boolean" ? s.encode : J.encode,
    encodeDotInKeys: typeof s.encodeDotInKeys == "boolean" ? s.encodeDotInKeys : J.encodeDotInKeys,
    encoder: typeof s.encoder == "function" ? s.encoder : J.encoder,
    encodeValuesOnly: typeof s.encodeValuesOnly == "boolean" ? s.encodeValuesOnly : J.encodeValuesOnly,
    filter: r,
    format: t,
    formatter: n,
    serializeDate: typeof s.serializeDate == "function" ? s.serializeDate : J.serializeDate,
    skipNulls: typeof s.skipNulls == "boolean" ? s.skipNulls : J.skipNulls,
    // @ts-ignore
    sort: typeof s.sort == "function" ? s.sort : null,
    strictNullHandling: typeof s.strictNullHandling == "boolean" ? s.strictNullHandling : J.strictNullHandling
  };
}
function Si(s, e = {}) {
  let t = s;
  const n = vi(e);
  let r, a;
  typeof n.filter == "function" ? (a = n.filter, t = a("", t)) : le(n.filter) && (a = n.filter, r = a);
  const i = [];
  if (typeof t != "object" || t === null)
    return "";
  const o = gr[n.arrayFormat], c = o === "comma" && n.commaRoundTrip;
  r || (r = Object.keys(t)), n.sort && r.sort(n.sort);
  const l = /* @__PURE__ */ new WeakMap();
  for (let f = 0; f < r.length; ++f) {
    const g = r[f];
    n.skipNulls && t[g] === null || _r(i, yr(
      t[g],
      g,
      // @ts-expect-error
      o,
      c,
      n.allowEmptyArrays,
      n.strictNullHandling,
      n.skipNulls,
      n.encodeDotInKeys,
      n.encode ? n.encoder : null,
      n.filter,
      n.sort,
      n.allowDots,
      n.serializeDate,
      n.format,
      n.formatter,
      n.encodeValuesOnly,
      n.charset,
      l
    ));
  }
  const d = i.join(n.delimiter);
  let u = n.addQueryPrefix === !0 ? "?" : "";
  return n.charsetSentinel && (n.charset === "iso-8859-1" ? u += "utf8=%26%2310003%3B&" : u += "utf8=%E2%9C%93&"), d.length > 0 ? u + d : "";
}
const Be = "4.104.0";
let js = !1, at, wr, br, An, xr, vr, Sr, Ar, kr;
function Ai(s, e = { auto: !1 }) {
  if (js)
    throw new Error(`you must \`import 'openai/shims/${s.kind}'\` before importing anything else from openai`);
  if (at)
    throw new Error(`can't \`import 'openai/shims/${s.kind}'\` after \`import 'openai/shims/${at}'\``);
  js = e.auto, at = s.kind, wr = s.fetch, br = s.FormData, An = s.File, xr = s.ReadableStream, vr = s.getMultipartRequestOptions, Sr = s.getDefaultAgent, Ar = s.fileFromPath, kr = s.isFsReadStream;
}
class ki {
  constructor(e) {
    this.body = e;
  }
  get [Symbol.toStringTag]() {
    return "MultipartBody";
  }
}
function Ci({ manuallyImported: s } = {}) {
  const e = s ? "You may need to use polyfills" : "Add one of these imports before your first `import … from 'openai'`:\n- `import 'openai/shims/node'` (if you're running on Node)\n- `import 'openai/shims/web'` (otherwise)\n";
  let t, n, r, a;
  try {
    t = fetch, n = Request, r = Response, a = Headers;
  } catch (i) {
    throw new Error(`this environment is missing the following Web Fetch API type: ${i.message}. ${e}`);
  }
  return {
    kind: "web",
    fetch: t,
    Request: n,
    Response: r,
    Headers: a,
    FormData: (
      // @ts-ignore
      typeof FormData < "u" ? FormData : class {
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'FormData' is undefined. ${e}`);
        }
      }
    ),
    Blob: typeof Blob < "u" ? Blob : class {
      constructor() {
        throw new Error(`file uploads aren't supported in this environment yet as 'Blob' is undefined. ${e}`);
      }
    },
    File: (
      // @ts-ignore
      typeof File < "u" ? File : class {
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'File' is undefined. ${e}`);
        }
      }
    ),
    ReadableStream: (
      // @ts-ignore
      typeof ReadableStream < "u" ? ReadableStream : class {
        // @ts-ignore
        constructor() {
          throw new Error(`streaming isn't supported in this environment yet as 'ReadableStream' is undefined. ${e}`);
        }
      }
    ),
    getMultipartRequestOptions: async (i, o) => ({
      ...o,
      body: new ki(i)
    }),
    getDefaultAgent: (i) => {
    },
    fileFromPath: () => {
      throw new Error("The `fileFromPath` function is only supported in Node. See the README for more details: https://www.github.com/openai/openai-node#file-uploads");
    },
    isFsReadStream: (i) => !1
  };
}
const Cr = () => {
  at || Ai(Ci(), { auto: !0 });
};
Cr();
class A extends Error {
}
class G extends A {
  constructor(e, t, n, r) {
    super(`${G.makeMessage(e, t, n)}`), this.status = e, this.headers = r, this.request_id = r == null ? void 0 : r["x-request-id"], this.error = t;
    const a = t;
    this.code = a == null ? void 0 : a.code, this.param = a == null ? void 0 : a.param, this.type = a == null ? void 0 : a.type;
  }
  static makeMessage(e, t, n) {
    const r = t != null && t.message ? typeof t.message == "string" ? t.message : JSON.stringify(t.message) : t ? JSON.stringify(t) : n;
    return e && r ? `${e} ${r}` : e ? `${e} status code (no body)` : r || "(no status code or body)";
  }
  static generate(e, t, n, r) {
    if (!e || !r)
      return new Vt({ message: n, cause: Cn(t) });
    const a = t == null ? void 0 : t.error;
    return e === 400 ? new Pr(e, a, n, r) : e === 401 ? new Rr(e, a, n, r) : e === 403 ? new Ir(e, a, n, r) : e === 404 ? new Er(e, a, n, r) : e === 409 ? new $r(e, a, n, r) : e === 422 ? new Tr(e, a, n, r) : e === 429 ? new Or(e, a, n, r) : e >= 500 ? new Fr(e, a, n, r) : new G(e, a, n, r);
  }
}
class se extends G {
  constructor({ message: e } = {}) {
    super(void 0, void 0, e || "Request was aborted.", void 0);
  }
}
class Vt extends G {
  constructor({ message: e, cause: t }) {
    super(void 0, void 0, e || "Connection error.", void 0), t && (this.cause = t);
  }
}
class Ln extends Vt {
  constructor({ message: e } = {}) {
    super({ message: e ?? "Request timed out." });
  }
}
class Pr extends G {
}
class Rr extends G {
}
class Ir extends G {
}
class Er extends G {
}
class $r extends G {
}
class Tr extends G {
}
class Or extends G {
}
class Fr extends G {
}
class Nr extends A {
  constructor() {
    super("Could not parse response content as the length limit was reached");
  }
}
class Mr extends A {
  constructor() {
    super("Could not parse response content as the request was rejected by the content filter");
  }
}
var wt = function(s, e, t, n, r) {
  if (n === "m") throw new TypeError("Private method is not writable");
  if (n === "a" && !r) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return n === "a" ? r.call(s, t) : r ? r.value = t : e.set(s, t), t;
}, Re = function(s, e, t, n) {
  if (t === "a" && !n) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? n : t === "a" ? n.call(s) : n ? n.value : e.get(s);
}, ee;
class Zt {
  constructor() {
    ee.set(this, void 0), this.buffer = new Uint8Array(), wt(this, ee, null, "f");
  }
  decode(e) {
    if (e == null)
      return [];
    const t = e instanceof ArrayBuffer ? new Uint8Array(e) : typeof e == "string" ? new TextEncoder().encode(e) : e;
    let n = new Uint8Array(this.buffer.length + t.length);
    n.set(this.buffer), n.set(t, this.buffer.length), this.buffer = n;
    const r = [];
    let a;
    for (; (a = Pi(this.buffer, Re(this, ee, "f"))) != null; ) {
      if (a.carriage && Re(this, ee, "f") == null) {
        wt(this, ee, a.index, "f");
        continue;
      }
      if (Re(this, ee, "f") != null && (a.index !== Re(this, ee, "f") + 1 || a.carriage)) {
        r.push(this.decodeText(this.buffer.slice(0, Re(this, ee, "f") - 1))), this.buffer = this.buffer.slice(Re(this, ee, "f")), wt(this, ee, null, "f");
        continue;
      }
      const i = Re(this, ee, "f") !== null ? a.preceding - 1 : a.preceding, o = this.decodeText(this.buffer.slice(0, i));
      r.push(o), this.buffer = this.buffer.slice(a.index), wt(this, ee, null, "f");
    }
    return r;
  }
  decodeText(e) {
    if (e == null)
      return "";
    if (typeof e == "string")
      return e;
    if (typeof Buffer < "u") {
      if (e instanceof Buffer)
        return e.toString();
      if (e instanceof Uint8Array)
        return Buffer.from(e).toString();
      throw new A(`Unexpected: received non-Uint8Array (${e.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`);
    }
    if (typeof TextDecoder < "u") {
      if (e instanceof Uint8Array || e instanceof ArrayBuffer)
        return this.textDecoder ?? (this.textDecoder = new TextDecoder("utf8")), this.textDecoder.decode(e);
      throw new A(`Unexpected: received non-Uint8Array/ArrayBuffer (${e.constructor.name}) in a web platform. Please report this error.`);
    }
    throw new A("Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.");
  }
  flush() {
    return this.buffer.length ? this.decode(`
`) : [];
  }
}
ee = /* @__PURE__ */ new WeakMap();
Zt.NEWLINE_CHARS = /* @__PURE__ */ new Set([`
`, "\r"]);
Zt.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
function Pi(s, e) {
  for (let r = e ?? 0; r < s.length; r++) {
    if (s[r] === 10)
      return { preceding: r, index: r + 1, carriage: !1 };
    if (s[r] === 13)
      return { preceding: r, index: r + 1, carriage: !0 };
  }
  return null;
}
function Ri(s) {
  for (let n = 0; n < s.length - 1; n++) {
    if (s[n] === 10 && s[n + 1] === 10 || s[n] === 13 && s[n + 1] === 13)
      return n + 2;
    if (s[n] === 13 && s[n + 1] === 10 && n + 3 < s.length && s[n + 2] === 13 && s[n + 3] === 10)
      return n + 4;
  }
  return -1;
}
function Dr(s) {
  if (s[Symbol.asyncIterator])
    return s;
  const e = s.getReader();
  return {
    async next() {
      try {
        const t = await e.read();
        return t != null && t.done && e.releaseLock(), t;
      } catch (t) {
        throw e.releaseLock(), t;
      }
    },
    async return() {
      const t = e.cancel();
      return e.releaseLock(), await t, { done: !0, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
class de {
  constructor(e, t) {
    this.iterator = e, this.controller = t;
  }
  static fromSSEResponse(e, t) {
    let n = !1;
    async function* r() {
      if (n)
        throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      n = !0;
      let a = !1;
      try {
        for await (const i of Ii(e, t))
          if (!a) {
            if (i.data.startsWith("[DONE]")) {
              a = !0;
              continue;
            }
            if (i.event === null || i.event.startsWith("response.") || i.event.startsWith("transcript.")) {
              let o;
              try {
                o = JSON.parse(i.data);
              } catch (c) {
                throw console.error("Could not parse message into JSON:", i.data), console.error("From chunk:", i.raw), c;
              }
              if (o && o.error)
                throw new G(void 0, o.error, void 0, Zr(e.headers));
              yield o;
            } else {
              let o;
              try {
                o = JSON.parse(i.data);
              } catch (c) {
                throw console.error("Could not parse message into JSON:", i.data), console.error("From chunk:", i.raw), c;
              }
              if (i.event == "error")
                throw new G(void 0, o.error, o.message, void 0);
              yield { event: i.event, data: o };
            }
          }
        a = !0;
      } catch (i) {
        if (i instanceof Error && i.name === "AbortError")
          return;
        throw i;
      } finally {
        a || t.abort();
      }
    }
    return new de(r, t);
  }
  /**
   * Generates a Stream from a newline-separated ReadableStream
   * where each item is a JSON value.
   */
  static fromReadableStream(e, t) {
    let n = !1;
    async function* r() {
      const i = new Zt(), o = Dr(e);
      for await (const c of o)
        for (const l of i.decode(c))
          yield l;
      for (const c of i.flush())
        yield c;
    }
    async function* a() {
      if (n)
        throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      n = !0;
      let i = !1;
      try {
        for await (const o of r())
          i || o && (yield JSON.parse(o));
        i = !0;
      } catch (o) {
        if (o instanceof Error && o.name === "AbortError")
          return;
        throw o;
      } finally {
        i || t.abort();
      }
    }
    return new de(a, t);
  }
  [Symbol.asyncIterator]() {
    return this.iterator();
  }
  /**
   * Splits the stream into two streams which can be
   * independently read from at different speeds.
   */
  tee() {
    const e = [], t = [], n = this.iterator(), r = (a) => ({
      next: () => {
        if (a.length === 0) {
          const i = n.next();
          e.push(i), t.push(i);
        }
        return a.shift();
      }
    });
    return [
      new de(() => r(e), this.controller),
      new de(() => r(t), this.controller)
    ];
  }
  /**
   * Converts this stream to a newline-separated ReadableStream of
   * JSON stringified values in the stream
   * which can be turned back into a Stream with `Stream.fromReadableStream()`.
   */
  toReadableStream() {
    const e = this;
    let t;
    const n = new TextEncoder();
    return new xr({
      async start() {
        t = e[Symbol.asyncIterator]();
      },
      async pull(r) {
        try {
          const { value: a, done: i } = await t.next();
          if (i)
            return r.close();
          const o = n.encode(JSON.stringify(a) + `
`);
          r.enqueue(o);
        } catch (a) {
          r.error(a);
        }
      },
      async cancel() {
        var r;
        await ((r = t.return) == null ? void 0 : r.call(t));
      }
    });
  }
}
async function* Ii(s, e) {
  if (!s.body)
    throw e.abort(), new A("Attempted to iterate over a response with no body");
  const t = new $i(), n = new Zt(), r = Dr(s.body);
  for await (const a of Ei(r))
    for (const i of n.decode(a)) {
      const o = t.decode(i);
      o && (yield o);
    }
  for (const a of n.flush()) {
    const i = t.decode(a);
    i && (yield i);
  }
}
async function* Ei(s) {
  let e = new Uint8Array();
  for await (const t of s) {
    if (t == null)
      continue;
    const n = t instanceof ArrayBuffer ? new Uint8Array(t) : typeof t == "string" ? new TextEncoder().encode(t) : t;
    let r = new Uint8Array(e.length + n.length);
    r.set(e), r.set(n, e.length), e = r;
    let a;
    for (; (a = Ri(e)) !== -1; )
      yield e.slice(0, a), e = e.slice(a);
  }
  e.length > 0 && (yield e);
}
class $i {
  constructor() {
    this.event = null, this.data = [], this.chunks = [];
  }
  decode(e) {
    if (e.endsWith("\r") && (e = e.substring(0, e.length - 1)), !e) {
      if (!this.event && !this.data.length)
        return null;
      const a = {
        event: this.event,
        data: this.data.join(`
`),
        raw: this.chunks
      };
      return this.event = null, this.data = [], this.chunks = [], a;
    }
    if (this.chunks.push(e), e.startsWith(":"))
      return null;
    let [t, n, r] = Ti(e, ":");
    return r.startsWith(" ") && (r = r.substring(1)), t === "event" ? this.event = r : t === "data" && this.data.push(r), null;
  }
}
function Ti(s, e) {
  const t = s.indexOf(e);
  return t !== -1 ? [s.substring(0, t), e, s.substring(t + e.length)] : [s, "", ""];
}
const Lr = (s) => s != null && typeof s == "object" && typeof s.url == "string" && typeof s.blob == "function", Br = (s) => s != null && typeof s == "object" && typeof s.name == "string" && typeof s.lastModified == "number" && Jt(s), Jt = (s) => s != null && typeof s == "object" && typeof s.size == "number" && typeof s.type == "string" && typeof s.text == "function" && typeof s.slice == "function" && typeof s.arrayBuffer == "function", Oi = (s) => Br(s) || Lr(s) || kr(s);
async function jr(s, e, t) {
  var r;
  if (s = await s, Br(s))
    return s;
  if (Lr(s)) {
    const a = await s.blob();
    e || (e = new URL(s.url).pathname.split(/[\\/]/).pop() ?? "unknown_file");
    const i = Jt(a) ? [await a.arrayBuffer()] : [a];
    return new An(i, e, t);
  }
  const n = await Fi(s);
  if (e || (e = Mi(s) ?? "unknown_file"), !(t != null && t.type)) {
    const a = (r = n[0]) == null ? void 0 : r.type;
    typeof a == "string" && (t = { ...t, type: a });
  }
  return new An(n, e, t);
}
async function Fi(s) {
  var t;
  let e = [];
  if (typeof s == "string" || ArrayBuffer.isView(s) || // includes Uint8Array, Buffer, etc.
  s instanceof ArrayBuffer)
    e.push(s);
  else if (Jt(s))
    e.push(await s.arrayBuffer());
  else if (Di(s))
    for await (const n of s)
      e.push(n);
  else
    throw new Error(`Unexpected data type: ${typeof s}; constructor: ${(t = s == null ? void 0 : s.constructor) == null ? void 0 : t.name}; props: ${Ni(s)}`);
  return e;
}
function Ni(s) {
  return `[${Object.getOwnPropertyNames(s).map((t) => `"${t}"`).join(", ")}]`;
}
function Mi(s) {
  var e;
  return cn(s.name) || cn(s.filename) || // For fs.ReadStream
  ((e = cn(s.path)) == null ? void 0 : e.split(/[\\/]/).pop());
}
const cn = (s) => {
  if (typeof s == "string")
    return s;
  if (typeof Buffer < "u" && s instanceof Buffer)
    return String(s);
}, Di = (s) => s != null && typeof s == "object" && typeof s[Symbol.asyncIterator] == "function", Us = (s) => s && typeof s == "object" && s.body && s[Symbol.toStringTag] === "MultipartBody", Te = async (s) => {
  const e = await Li(s.body);
  return vr(e, s);
}, Li = async (s) => {
  const e = new br();
  return await Promise.all(Object.entries(s || {}).map(([t, n]) => kn(e, t, n))), e;
}, kn = async (s, e, t) => {
  if (t !== void 0) {
    if (t == null)
      throw new TypeError(`Received null for "${e}"; to pass null in FormData, you must use the string 'null'`);
    if (typeof t == "string" || typeof t == "number" || typeof t == "boolean")
      s.append(e, String(t));
    else if (Oi(t)) {
      const n = await jr(t);
      s.append(e, n);
    } else if (Array.isArray(t))
      await Promise.all(t.map((n) => kn(s, e + "[]", n)));
    else if (typeof t == "object")
      await Promise.all(Object.entries(t).map(([n, r]) => kn(s, `${e}[${n}]`, r)));
    else
      throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${t} instead`);
  }
};
var Bi = function(s, e, t, n, r) {
  if (n === "m") throw new TypeError("Private method is not writable");
  if (n === "a" && !r) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return n === "a" ? r.call(s, t) : r ? r.value = t : e.set(s, t), t;
}, ji = function(s, e, t, n) {
  if (t === "a" && !n) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? n : t === "a" ? n.call(s) : n ? n.value : e.get(s);
}, bt;
Cr();
async function Ur(s) {
  var i;
  const { response: e } = s;
  if (s.options.stream)
    return ve("response", e.status, e.url, e.headers, e.body), s.options.__streamClass ? s.options.__streamClass.fromSSEResponse(e, s.controller) : de.fromSSEResponse(e, s.controller);
  if (e.status === 204)
    return null;
  if (s.options.__binaryResponse)
    return e;
  const t = e.headers.get("content-type"), n = (i = t == null ? void 0 : t.split(";")[0]) == null ? void 0 : i.trim();
  if ((n == null ? void 0 : n.includes("application/json")) || (n == null ? void 0 : n.endsWith("+json"))) {
    const o = await e.json();
    return ve("response", e.status, e.url, e.headers, o), Wr(o, e);
  }
  const a = await e.text();
  return ve("response", e.status, e.url, e.headers, a), a;
}
function Wr(s, e) {
  return !s || typeof s != "object" || Array.isArray(s) ? s : Object.defineProperty(s, "_request_id", {
    value: e.headers.get("x-request-id"),
    enumerable: !1
  });
}
class zt extends Promise {
  constructor(e, t = Ur) {
    super((n) => {
      n(null);
    }), this.responsePromise = e, this.parseResponse = t;
  }
  _thenUnwrap(e) {
    return new zt(this.responsePromise, async (t) => Wr(e(await this.parseResponse(t), t), t.response));
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` if you can,
   * or add one of these imports before your first `import … from 'openai'`:
   * - `import 'openai/shims/node'` (if you're running on Node)
   * - `import 'openai/shims/web'` (otherwise)
   */
  asResponse() {
    return this.responsePromise.then((e) => e.response);
  }
  /**
   * Gets the parsed response data, the raw `Response` instance and the ID of the request,
   * returned via the X-Request-ID header which is useful for debugging requests and reporting
   * issues to OpenAI.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   *
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` if you can,
   * or add one of these imports before your first `import … from 'openai'`:
   * - `import 'openai/shims/node'` (if you're running on Node)
   * - `import 'openai/shims/web'` (otherwise)
   */
  async withResponse() {
    const [e, t] = await Promise.all([this.parse(), this.asResponse()]);
    return { data: e, response: t, request_id: t.headers.get("x-request-id") };
  }
  parse() {
    return this.parsedPromise || (this.parsedPromise = this.responsePromise.then(this.parseResponse)), this.parsedPromise;
  }
  then(e, t) {
    return this.parse().then(e, t);
  }
  catch(e) {
    return this.parse().catch(e);
  }
  finally(e) {
    return this.parse().finally(e);
  }
}
class Ui {
  constructor({
    baseURL: e,
    maxRetries: t = 2,
    timeout: n = 6e5,
    // 10 minutes
    httpAgent: r,
    fetch: a
  }) {
    this.baseURL = e, this.maxRetries = ln("maxRetries", t), this.timeout = ln("timeout", n), this.httpAgent = r, this.fetch = a ?? wr;
  }
  authHeaders(e) {
    return {};
  }
  /**
   * Override this to add your own default headers, for example:
   *
   *  {
   *    ...super.defaultHeaders(),
   *    Authorization: 'Bearer 123',
   *  }
   */
  defaultHeaders(e) {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": this.getUserAgent(),
      ...zi(),
      ...this.authHeaders(e)
    };
  }
  /**
   * Override this to add your own headers validation:
   */
  validateHeaders(e, t) {
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${Gi()}`;
  }
  get(e, t) {
    return this.methodRequest("get", e, t);
  }
  post(e, t) {
    return this.methodRequest("post", e, t);
  }
  patch(e, t) {
    return this.methodRequest("patch", e, t);
  }
  put(e, t) {
    return this.methodRequest("put", e, t);
  }
  delete(e, t) {
    return this.methodRequest("delete", e, t);
  }
  methodRequest(e, t, n) {
    return this.request(Promise.resolve(n).then(async (r) => {
      const a = r && Jt(r == null ? void 0 : r.body) ? new DataView(await r.body.arrayBuffer()) : (r == null ? void 0 : r.body) instanceof DataView ? r.body : (r == null ? void 0 : r.body) instanceof ArrayBuffer ? new DataView(r.body) : r && ArrayBuffer.isView(r == null ? void 0 : r.body) ? new DataView(r.body.buffer) : r == null ? void 0 : r.body;
      return { method: e, path: t, ...r, body: a };
    }));
  }
  getAPIList(e, t, n) {
    return this.requestAPIList(t, { method: "get", path: e, ...n });
  }
  calculateContentLength(e) {
    if (typeof e == "string") {
      if (typeof Buffer < "u")
        return Buffer.byteLength(e, "utf8").toString();
      if (typeof TextEncoder < "u")
        return new TextEncoder().encode(e).length.toString();
    } else if (ArrayBuffer.isView(e))
      return e.byteLength.toString();
    return null;
  }
  buildRequest(e, { retryCount: t = 0 } = {}) {
    var y;
    const n = { ...e }, { method: r, path: a, query: i, headers: o = {} } = n, c = ArrayBuffer.isView(n.body) || n.__binaryRequest && typeof n.body == "string" ? n.body : Us(n.body) ? n.body.body : n.body ? JSON.stringify(n.body, null, 2) : null, l = this.calculateContentLength(c), d = this.buildURL(a, i);
    "timeout" in n && ln("timeout", n.timeout), n.timeout = n.timeout ?? this.timeout;
    const u = n.httpAgent ?? this.httpAgent ?? Sr(d), f = n.timeout + 1e3;
    typeof ((y = u == null ? void 0 : u.options) == null ? void 0 : y.timeout) == "number" && f > (u.options.timeout ?? 0) && (u.options.timeout = f), this.idempotencyHeader && r !== "get" && (e.idempotencyKey || (e.idempotencyKey = this.defaultIdempotencyKey()), o[this.idempotencyHeader] = e.idempotencyKey);
    const g = this.buildHeaders({ options: n, headers: o, contentLength: l, retryCount: t });
    return { req: {
      method: r,
      ...c && { body: c },
      headers: g,
      ...u && { agent: u },
      // @ts-ignore node-fetch uses a custom AbortSignal type that is
      // not compatible with standard web types
      signal: n.signal ?? null
    }, url: d, timeout: n.timeout };
  }
  buildHeaders({ options: e, headers: t, contentLength: n, retryCount: r }) {
    const a = {};
    n && (a["content-length"] = n);
    const i = this.defaultHeaders(e);
    return Js(a, i), Js(a, t), Us(e.body) && at !== "node" && delete a["content-type"], vt(i, "x-stainless-retry-count") === void 0 && vt(t, "x-stainless-retry-count") === void 0 && (a["x-stainless-retry-count"] = String(r)), vt(i, "x-stainless-timeout") === void 0 && vt(t, "x-stainless-timeout") === void 0 && e.timeout && (a["x-stainless-timeout"] = String(Math.trunc(e.timeout / 1e3))), this.validateHeaders(a, t), a;
  }
  /**
   * Used as a callback for mutating the given `FinalRequestOptions` object.
   */
  async prepareOptions(e) {
  }
  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  async prepareRequest(e, { url: t, options: n }) {
  }
  parseHeaders(e) {
    return e ? Symbol.iterator in e ? Object.fromEntries(Array.from(e).map((t) => [...t])) : { ...e } : {};
  }
  makeStatusError(e, t, n, r) {
    return G.generate(e, t, n, r);
  }
  request(e, t = null) {
    return new zt(this.makeRequest(e, t));
  }
  async makeRequest(e, t) {
    var u, f;
    const n = await e, r = n.maxRetries ?? this.maxRetries;
    t == null && (t = r), await this.prepareOptions(n);
    const { req: a, url: i, timeout: o } = this.buildRequest(n, { retryCount: r - t });
    if (await this.prepareRequest(a, { url: i, options: n }), ve("request", i, n, a.headers), (u = n.signal) != null && u.aborted)
      throw new se();
    const c = new AbortController(), l = await this.fetchWithTimeout(i, a, o, c).catch(Cn);
    if (l instanceof Error) {
      if ((f = n.signal) != null && f.aborted)
        throw new se();
      if (t)
        return this.retryRequest(n, t);
      throw l.name === "AbortError" ? new Ln() : new Vt({ cause: l });
    }
    const d = Zr(l.headers);
    if (!l.ok) {
      if (t && this.shouldRetry(l)) {
        const m = `retrying, ${t} attempts remaining`;
        return ve(`response (error; ${m})`, l.status, i, d), this.retryRequest(n, t, d);
      }
      const g = await l.text().catch((m) => Cn(m).message), x = qi(g), y = x ? void 0 : g;
      throw ve(`response (error; ${t ? "(error; no more retries left)" : "(error; not retryable)"})`, l.status, i, d, y), this.makeStatusError(l.status, x, y, d);
    }
    return { response: l, options: n, controller: c };
  }
  requestAPIList(e, t) {
    const n = this.makeRequest(t, null);
    return new Wi(this, n, e);
  }
  buildURL(e, t) {
    const n = Xi(e) ? new URL(e) : new URL(this.baseURL + (this.baseURL.endsWith("/") && e.startsWith("/") ? e.slice(1) : e)), r = this.defaultQuery();
    return Jr(r) || (t = { ...r, ...t }), typeof t == "object" && t && !Array.isArray(t) && (n.search = this.stringifyQuery(t)), n.toString();
  }
  stringifyQuery(e) {
    return Object.entries(e).filter(([t, n]) => typeof n < "u").map(([t, n]) => {
      if (typeof n == "string" || typeof n == "number" || typeof n == "boolean")
        return `${encodeURIComponent(t)}=${encodeURIComponent(n)}`;
      if (n === null)
        return `${encodeURIComponent(t)}=`;
      throw new A(`Cannot stringify type ${typeof n}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
    }).join("&");
  }
  async fetchWithTimeout(e, t, n, r) {
    const { signal: a, ...i } = t || {};
    a && a.addEventListener("abort", () => r.abort());
    const o = setTimeout(() => r.abort(), n), c = {
      signal: r.signal,
      ...i
    };
    return c.method && (c.method = c.method.toUpperCase()), // use undefined this binding; fetch errors if bound to something else in browser/cloudflare
    this.fetch.call(void 0, e, c).finally(() => {
      clearTimeout(o);
    });
  }
  shouldRetry(e) {
    const t = e.headers.get("x-should-retry");
    return t === "true" ? !0 : t === "false" ? !1 : e.status === 408 || e.status === 409 || e.status === 429 || e.status >= 500;
  }
  async retryRequest(e, t, n) {
    let r;
    const a = n == null ? void 0 : n["retry-after-ms"];
    if (a) {
      const o = parseFloat(a);
      Number.isNaN(o) || (r = o);
    }
    const i = n == null ? void 0 : n["retry-after"];
    if (i && !r) {
      const o = parseFloat(i);
      Number.isNaN(o) ? r = Date.parse(i) - Date.now() : r = o * 1e3;
    }
    if (!(r && 0 <= r && r < 60 * 1e3)) {
      const o = e.maxRetries ?? this.maxRetries;
      r = this.calculateDefaultRetryTimeoutMillis(t, o);
    }
    return await ht(r), this.makeRequest(e, t - 1);
  }
  calculateDefaultRetryTimeoutMillis(e, t) {
    const a = t - e, i = Math.min(0.5 * Math.pow(2, a), 8), o = 1 - Math.random() * 0.25;
    return i * o * 1e3;
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${Be}`;
  }
}
class Vr {
  constructor(e, t, n, r) {
    bt.set(this, void 0), Bi(this, bt, e, "f"), this.options = r, this.response = t, this.body = n;
  }
  hasNextPage() {
    return this.getPaginatedItems().length ? this.nextPageInfo() != null : !1;
  }
  async getNextPage() {
    const e = this.nextPageInfo();
    if (!e)
      throw new A("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
    const t = { ...this.options };
    if ("params" in e && typeof t.query == "object")
      t.query = { ...t.query, ...e.params };
    else if ("url" in e) {
      const n = [...Object.entries(t.query || {}), ...e.url.searchParams.entries()];
      for (const [r, a] of n)
        e.url.searchParams.set(r, a);
      t.query = void 0, t.path = e.url.toString();
    }
    return await ji(this, bt, "f").requestAPIList(this.constructor, t);
  }
  async *iterPages() {
    let e = this;
    for (yield e; e.hasNextPage(); )
      e = await e.getNextPage(), yield e;
  }
  async *[(bt = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    for await (const e of this.iterPages())
      for (const t of e.getPaginatedItems())
        yield t;
  }
}
class Wi extends zt {
  constructor(e, t, n) {
    super(t, async (r) => new n(e, r.response, await Ur(r), r.options));
  }
  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator]() {
    const e = await this;
    for await (const t of e)
      yield t;
  }
}
const Zr = (s) => new Proxy(Object.fromEntries(
  // @ts-ignore
  s.entries()
), {
  get(e, t) {
    const n = t.toString();
    return e[n.toLowerCase()] || e[n];
  }
}), Vi = {
  method: !0,
  path: !0,
  query: !0,
  body: !0,
  headers: !0,
  maxRetries: !0,
  stream: !0,
  timeout: !0,
  httpAgent: !0,
  signal: !0,
  idempotencyKey: !0,
  __metadata: !0,
  __binaryRequest: !0,
  __binaryResponse: !0,
  __streamClass: !0
}, W = (s) => typeof s == "object" && s !== null && !Jr(s) && Object.keys(s).every((e) => zr(Vi, e)), Zi = () => {
  var e;
  if (typeof Deno < "u" && Deno.build != null)
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Be,
      "X-Stainless-OS": Vs(Deno.build.os),
      "X-Stainless-Arch": Ws(Deno.build.arch),
      "X-Stainless-Runtime": "deno",
      "X-Stainless-Runtime-Version": typeof Deno.version == "string" ? Deno.version : ((e = Deno.version) == null ? void 0 : e.deno) ?? "unknown"
    };
  if (typeof EdgeRuntime < "u")
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Be,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": "edge",
      "X-Stainless-Runtime-Version": process.version
    };
  if (Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]")
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": Be,
      "X-Stainless-OS": Vs(process.platform),
      "X-Stainless-Arch": Ws(process.arch),
      "X-Stainless-Runtime": "node",
      "X-Stainless-Runtime-Version": process.version
    };
  const s = Ji();
  return s ? {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": Be,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": `browser:${s.browser}`,
    "X-Stainless-Runtime-Version": s.version
  } : {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": Be,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": "unknown",
    "X-Stainless-Runtime-Version": "unknown"
  };
};
function Ji() {
  if (typeof navigator > "u" || !navigator)
    return null;
  const s = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
  ];
  for (const { key: e, pattern: t } of s) {
    const n = t.exec(navigator.userAgent);
    if (n) {
      const r = n[1] || 0, a = n[2] || 0, i = n[3] || 0;
      return { browser: e, version: `${r}.${a}.${i}` };
    }
  }
  return null;
}
const Ws = (s) => s === "x32" ? "x32" : s === "x86_64" || s === "x64" ? "x64" : s === "arm" ? "arm" : s === "aarch64" || s === "arm64" ? "arm64" : s ? `other:${s}` : "unknown", Vs = (s) => (s = s.toLowerCase(), s.includes("ios") ? "iOS" : s === "android" ? "Android" : s === "darwin" ? "MacOS" : s === "win32" ? "Windows" : s === "freebsd" ? "FreeBSD" : s === "openbsd" ? "OpenBSD" : s === "linux" ? "Linux" : s ? `Other:${s}` : "Unknown");
let Zs;
const zi = () => Zs ?? (Zs = Zi()), qi = (s) => {
  try {
    return JSON.parse(s);
  } catch {
    return;
  }
}, Hi = /^[a-z][a-z0-9+.-]*:/i, Xi = (s) => Hi.test(s), ht = (s) => new Promise((e) => setTimeout(e, s)), ln = (s, e) => {
  if (typeof e != "number" || !Number.isInteger(e))
    throw new A(`${s} must be an integer`);
  if (e < 0)
    throw new A(`${s} must be a positive integer`);
  return e;
}, Cn = (s) => {
  if (s instanceof Error)
    return s;
  if (typeof s == "object" && s !== null)
    try {
      return new Error(JSON.stringify(s));
    } catch {
    }
  return new Error(s);
}, xt = (s) => {
  var e, t, n, r, a;
  if (typeof process < "u")
    return ((t = (e = process.env) == null ? void 0 : e[s]) == null ? void 0 : t.trim()) ?? void 0;
  if (typeof Deno < "u")
    return (a = (r = (n = Deno.env) == null ? void 0 : n.get) == null ? void 0 : r.call(n, s)) == null ? void 0 : a.trim();
};
function Jr(s) {
  if (!s)
    return !0;
  for (const e in s)
    return !1;
  return !0;
}
function zr(s, e) {
  return Object.prototype.hasOwnProperty.call(s, e);
}
function Js(s, e) {
  for (const t in e) {
    if (!zr(e, t))
      continue;
    const n = t.toLowerCase();
    if (!n)
      continue;
    const r = e[t];
    r === null ? delete s[n] : r !== void 0 && (s[n] = r);
  }
}
const zs = /* @__PURE__ */ new Set(["authorization", "api-key"]);
function ve(s, ...e) {
  var t;
  if (typeof process < "u" && ((t = process == null ? void 0 : process.env) == null ? void 0 : t.DEBUG) === "true") {
    const n = e.map((r) => {
      if (!r)
        return r;
      if (r.headers) {
        const i = { ...r, headers: { ...r.headers } };
        for (const o in r.headers)
          zs.has(o.toLowerCase()) && (i.headers[o] = "REDACTED");
        return i;
      }
      let a = null;
      for (const i in r)
        zs.has(i.toLowerCase()) && (a ?? (a = { ...r }), a[i] = "REDACTED");
      return a ?? r;
    });
    console.log(`OpenAI:DEBUG:${s}`, ...n);
  }
}
const Gi = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (s) => {
  const e = Math.random() * 16 | 0;
  return (s === "x" ? e : e & 3 | 8).toString(16);
}), Qi = () => (
  // @ts-ignore
  typeof window < "u" && // @ts-ignore
  typeof window.document < "u" && // @ts-ignore
  typeof navigator < "u"
), Yi = (s) => typeof (s == null ? void 0 : s.get) == "function", vt = (s, e) => {
  var n;
  const t = e.toLowerCase();
  if (Yi(s)) {
    const r = ((n = e[0]) == null ? void 0 : n.toUpperCase()) + e.substring(1).replace(/([^\w])(\w)/g, (a, i, o) => i + o.toUpperCase());
    for (const a of [e, t, e.toUpperCase(), r]) {
      const i = s.get(a);
      if (i)
        return i;
    }
  }
  for (const [r, a] of Object.entries(s))
    if (r.toLowerCase() === t)
      return Array.isArray(a) ? (a.length <= 1 || console.warn(`Received ${a.length} entries for the ${e} header, using the first entry.`), a[0]) : a;
}, Ki = (s) => {
  if (typeof Buffer < "u") {
    const e = Buffer.from(s, "base64");
    return Array.from(new Float32Array(e.buffer, e.byteOffset, e.length / Float32Array.BYTES_PER_ELEMENT));
  } else {
    const e = atob(s), t = e.length, n = new Uint8Array(t);
    for (let r = 0; r < t; r++)
      n[r] = e.charCodeAt(r);
    return Array.from(new Float32Array(n.buffer));
  }
};
function un(s) {
  return s != null && typeof s == "object" && !Array.isArray(s);
}
class qt extends Vr {
  constructor(e, t, n, r) {
    super(e, t, n, r), this.data = n.data || [], this.object = n.object;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  // @deprecated Please use `nextPageInfo()` instead
  /**
   * This page represents a response that isn't actually paginated at the API level
   * so there will never be any next page params.
   */
  nextPageParams() {
    return null;
  }
  nextPageInfo() {
    return null;
  }
}
class z extends Vr {
  constructor(e, t, n, r) {
    super(e, t, n, r), this.data = n.data || [], this.has_more = n.has_more || !1;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    return this.has_more === !1 ? !1 : super.hasNextPage();
  }
  // @deprecated Please use `nextPageInfo()` instead
  nextPageParams() {
    const e = this.nextPageInfo();
    if (!e)
      return null;
    if ("params" in e)
      return e.params;
    const t = Object.fromEntries(e.url.searchParams);
    return Object.keys(t).length ? t : null;
  }
  nextPageInfo() {
    var n;
    const e = this.getPaginatedItems();
    if (!e.length)
      return null;
    const t = (n = e[e.length - 1]) == null ? void 0 : n.id;
    return t ? { params: { after: t } } : null;
  }
}
class C {
  constructor(e) {
    this._client = e;
  }
}
let qr = class extends C {
  list(e, t = {}, n) {
    return W(t) ? this.list(e, {}, t) : this._client.getAPIList(`/chat/completions/${e}/messages`, eo, { query: t, ...n });
  }
}, Ht = class extends C {
  constructor() {
    super(...arguments), this.messages = new qr(this._client);
  }
  create(e, t) {
    return this._client.post("/chat/completions", { body: e, ...t, stream: e.stream ?? !1 });
  }
  /**
   * Get a stored chat completion. Only Chat Completions that have been created with
   * the `store` parameter set to `true` will be returned.
   *
   * @example
   * ```ts
   * const chatCompletion =
   *   await client.chat.completions.retrieve('completion_id');
   * ```
   */
  retrieve(e, t) {
    return this._client.get(`/chat/completions/${e}`, t);
  }
  /**
   * Modify a stored chat completion. Only Chat Completions that have been created
   * with the `store` parameter set to `true` can be modified. Currently, the only
   * supported modification is to update the `metadata` field.
   *
   * @example
   * ```ts
   * const chatCompletion = await client.chat.completions.update(
   *   'completion_id',
   *   { metadata: { foo: 'string' } },
   * );
   * ```
   */
  update(e, t, n) {
    return this._client.post(`/chat/completions/${e}`, { body: t, ...n });
  }
  list(e = {}, t) {
    return W(e) ? this.list({}, e) : this._client.getAPIList("/chat/completions", Xt, { query: e, ...t });
  }
  /**
   * Delete a stored chat completion. Only Chat Completions that have been created
   * with the `store` parameter set to `true` can be deleted.
   *
   * @example
   * ```ts
   * const chatCompletionDeleted =
   *   await client.chat.completions.del('completion_id');
   * ```
   */
  del(e, t) {
    return this._client.delete(`/chat/completions/${e}`, t);
  }
};
class Xt extends z {
}
class eo extends z {
}
Ht.ChatCompletionsPage = Xt;
Ht.Messages = qr;
let Gt = class extends C {
  constructor() {
    super(...arguments), this.completions = new Ht(this._client);
  }
};
Gt.Completions = Ht;
Gt.ChatCompletionsPage = Xt;
class Hr extends C {
  /**
   * Generates audio from the input text.
   *
   * @example
   * ```ts
   * const speech = await client.audio.speech.create({
   *   input: 'input',
   *   model: 'string',
   *   voice: 'ash',
   * });
   *
   * const content = await speech.blob();
   * console.log(content);
   * ```
   */
  create(e, t) {
    return this._client.post("/audio/speech", {
      body: e,
      ...t,
      headers: { Accept: "application/octet-stream", ...t == null ? void 0 : t.headers },
      __binaryResponse: !0
    });
  }
}
class Xr extends C {
  create(e, t) {
    return this._client.post("/audio/transcriptions", Te({
      body: e,
      ...t,
      stream: e.stream ?? !1,
      __metadata: { model: e.model }
    }));
  }
}
class Gr extends C {
  create(e, t) {
    return this._client.post("/audio/translations", Te({ body: e, ...t, __metadata: { model: e.model } }));
  }
}
class ft extends C {
  constructor() {
    super(...arguments), this.transcriptions = new Xr(this._client), this.translations = new Gr(this._client), this.speech = new Hr(this._client);
  }
}
ft.Transcriptions = Xr;
ft.Translations = Gr;
ft.Speech = Hr;
class Bn extends C {
  /**
   * Creates and executes a batch from an uploaded file of requests
   */
  create(e, t) {
    return this._client.post("/batches", { body: e, ...t });
  }
  /**
   * Retrieves a batch.
   */
  retrieve(e, t) {
    return this._client.get(`/batches/${e}`, t);
  }
  list(e = {}, t) {
    return W(e) ? this.list({}, e) : this._client.getAPIList("/batches", jn, { query: e, ...t });
  }
  /**
   * Cancels an in-progress batch. The batch will be in status `cancelling` for up to
   * 10 minutes, before changing to `cancelled`, where it will have partial results
   * (if any) available in the output file.
   */
  cancel(e, t) {
    return this._client.post(`/batches/${e}/cancel`, t);
  }
}
class jn extends z {
}
Bn.BatchesPage = jn;
var ae = function(s, e, t, n, r) {
  if (n === "m") throw new TypeError("Private method is not writable");
  if (n === "a" && !r) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return n === "a" ? r.call(s, t) : r ? r.value = t : e.set(s, t), t;
}, U = function(s, e, t, n) {
  if (t === "a" && !n) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? n : t === "a" ? n.call(s) : n ? n.value : e.get(s);
}, Pn, Rt, It, Ke, et, Et, tt, me, nt, Bt, jt, je, Qr;
class Un {
  constructor() {
    Pn.add(this), this.controller = new AbortController(), Rt.set(this, void 0), It.set(this, () => {
    }), Ke.set(this, () => {
    }), et.set(this, void 0), Et.set(this, () => {
    }), tt.set(this, () => {
    }), me.set(this, {}), nt.set(this, !1), Bt.set(this, !1), jt.set(this, !1), je.set(this, !1), ae(this, Rt, new Promise((e, t) => {
      ae(this, It, e, "f"), ae(this, Ke, t, "f");
    }), "f"), ae(this, et, new Promise((e, t) => {
      ae(this, Et, e, "f"), ae(this, tt, t, "f");
    }), "f"), U(this, Rt, "f").catch(() => {
    }), U(this, et, "f").catch(() => {
    });
  }
  _run(e) {
    setTimeout(() => {
      e().then(() => {
        this._emitFinal(), this._emit("end");
      }, U(this, Pn, "m", Qr).bind(this));
    }, 0);
  }
  _connected() {
    this.ended || (U(this, It, "f").call(this), this._emit("connect"));
  }
  get ended() {
    return U(this, nt, "f");
  }
  get errored() {
    return U(this, Bt, "f");
  }
  get aborted() {
    return U(this, jt, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  on(e, t) {
    return (U(this, me, "f")[e] || (U(this, me, "f")[e] = [])).push({ listener: t }), this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  off(e, t) {
    const n = U(this, me, "f")[e];
    if (!n)
      return this;
    const r = n.findIndex((a) => a.listener === t);
    return r >= 0 && n.splice(r, 1), this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  once(e, t) {
    return (U(this, me, "f")[e] || (U(this, me, "f")[e] = [])).push({ listener: t, once: !0 }), this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(e) {
    return new Promise((t, n) => {
      ae(this, je, !0, "f"), e !== "error" && this.once("error", n), this.once(e, t);
    });
  }
  async done() {
    ae(this, je, !0, "f"), await U(this, et, "f");
  }
  _emit(e, ...t) {
    if (U(this, nt, "f"))
      return;
    e === "end" && (ae(this, nt, !0, "f"), U(this, Et, "f").call(this));
    const n = U(this, me, "f")[e];
    if (n && (U(this, me, "f")[e] = n.filter((r) => !r.once), n.forEach(({ listener: r }) => r(...t))), e === "abort") {
      const r = t[0];
      !U(this, je, "f") && !(n != null && n.length) && Promise.reject(r), U(this, Ke, "f").call(this, r), U(this, tt, "f").call(this, r), this._emit("end");
      return;
    }
    if (e === "error") {
      const r = t[0];
      !U(this, je, "f") && !(n != null && n.length) && Promise.reject(r), U(this, Ke, "f").call(this, r), U(this, tt, "f").call(this, r), this._emit("end");
    }
  }
  _emitFinal() {
  }
}
Rt = /* @__PURE__ */ new WeakMap(), It = /* @__PURE__ */ new WeakMap(), Ke = /* @__PURE__ */ new WeakMap(), et = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ new WeakMap(), tt = /* @__PURE__ */ new WeakMap(), me = /* @__PURE__ */ new WeakMap(), nt = /* @__PURE__ */ new WeakMap(), Bt = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap(), je = /* @__PURE__ */ new WeakMap(), Pn = /* @__PURE__ */ new WeakSet(), Qr = function(e) {
  if (ae(this, Bt, !0, "f"), e instanceof Error && e.name === "AbortError" && (e = new se()), e instanceof se)
    return ae(this, jt, !0, "f"), this._emit("abort", e);
  if (e instanceof A)
    return this._emit("error", e);
  if (e instanceof Error) {
    const t = new A(e.message);
    return t.cause = e, this._emit("error", t);
  }
  return this._emit("error", new A(String(e)));
};
var v = function(s, e, t, n) {
  if (t === "a" && !n) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? n : t === "a" ? n.call(s) : n ? n.value : e.get(s);
}, K = function(s, e, t, n, r) {
  if (n === "m") throw new TypeError("Private method is not writable");
  if (n === "a" && !r) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return n === "a" ? r.call(s, t) : r ? r.value = t : e.set(s, t), t;
}, X, Rn, ue, $t, ie, Ee, Ue, Ie, Ut, te, Tt, Ot, it, st, rt, qs, Hs, Xs, Gs, Qs, Ys, Ks;
class oe extends Un {
  constructor() {
    super(...arguments), X.add(this), Rn.set(this, []), ue.set(this, {}), $t.set(this, {}), ie.set(this, void 0), Ee.set(this, void 0), Ue.set(this, void 0), Ie.set(this, void 0), Ut.set(this, void 0), te.set(this, void 0), Tt.set(this, void 0), Ot.set(this, void 0), it.set(this, void 0);
  }
  [(Rn = /* @__PURE__ */ new WeakMap(), ue = /* @__PURE__ */ new WeakMap(), $t = /* @__PURE__ */ new WeakMap(), ie = /* @__PURE__ */ new WeakMap(), Ee = /* @__PURE__ */ new WeakMap(), Ue = /* @__PURE__ */ new WeakMap(), Ie = /* @__PURE__ */ new WeakMap(), Ut = /* @__PURE__ */ new WeakMap(), te = /* @__PURE__ */ new WeakMap(), Tt = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), it = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
    const e = [], t = [];
    let n = !1;
    return this.on("event", (r) => {
      const a = t.shift();
      a ? a.resolve(r) : e.push(r);
    }), this.on("end", () => {
      n = !0;
      for (const r of t)
        r.resolve(void 0);
      t.length = 0;
    }), this.on("abort", (r) => {
      n = !0;
      for (const a of t)
        a.reject(r);
      t.length = 0;
    }), this.on("error", (r) => {
      n = !0;
      for (const a of t)
        a.reject(r);
      t.length = 0;
    }), {
      next: async () => e.length ? { value: e.shift(), done: !1 } : n ? { value: void 0, done: !0 } : new Promise((a, i) => t.push({ resolve: a, reject: i })).then((a) => a ? { value: a, done: !1 } : { value: void 0, done: !0 }),
      return: async () => (this.abort(), { value: void 0, done: !0 })
    };
  }
  static fromReadableStream(e) {
    const t = new oe();
    return t._run(() => t._fromReadableStream(e)), t;
  }
  async _fromReadableStream(e, t) {
    var a;
    const n = t == null ? void 0 : t.signal;
    n && (n.aborted && this.controller.abort(), n.addEventListener("abort", () => this.controller.abort())), this._connected();
    const r = de.fromReadableStream(e, this.controller);
    for await (const i of r)
      v(this, X, "m", st).call(this, i);
    if ((a = r.controller.signal) != null && a.aborted)
      throw new se();
    return this._addRun(v(this, X, "m", rt).call(this));
  }
  toReadableStream() {
    return new de(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
  static createToolAssistantStream(e, t, n, r, a) {
    const i = new oe();
    return i._run(() => i._runToolAssistantStream(e, t, n, r, {
      ...a,
      headers: { ...a == null ? void 0 : a.headers, "X-Stainless-Helper-Method": "stream" }
    })), i;
  }
  async _createToolAssistantStream(e, t, n, r, a) {
    var l;
    const i = a == null ? void 0 : a.signal;
    i && (i.aborted && this.controller.abort(), i.addEventListener("abort", () => this.controller.abort()));
    const o = { ...r, stream: !0 }, c = await e.submitToolOutputs(t, n, o, {
      ...a,
      signal: this.controller.signal
    });
    this._connected();
    for await (const d of c)
      v(this, X, "m", st).call(this, d);
    if ((l = c.controller.signal) != null && l.aborted)
      throw new se();
    return this._addRun(v(this, X, "m", rt).call(this));
  }
  static createThreadAssistantStream(e, t, n) {
    const r = new oe();
    return r._run(() => r._threadAssistantStream(e, t, {
      ...n,
      headers: { ...n == null ? void 0 : n.headers, "X-Stainless-Helper-Method": "stream" }
    })), r;
  }
  static createAssistantStream(e, t, n, r) {
    const a = new oe();
    return a._run(() => a._runAssistantStream(e, t, n, {
      ...r,
      headers: { ...r == null ? void 0 : r.headers, "X-Stainless-Helper-Method": "stream" }
    })), a;
  }
  currentEvent() {
    return v(this, Tt, "f");
  }
  currentRun() {
    return v(this, Ot, "f");
  }
  currentMessageSnapshot() {
    return v(this, ie, "f");
  }
  currentRunStepSnapshot() {
    return v(this, it, "f");
  }
  async finalRunSteps() {
    return await this.done(), Object.values(v(this, ue, "f"));
  }
  async finalMessages() {
    return await this.done(), Object.values(v(this, $t, "f"));
  }
  async finalRun() {
    if (await this.done(), !v(this, Ee, "f"))
      throw Error("Final run was not received.");
    return v(this, Ee, "f");
  }
  async _createThreadAssistantStream(e, t, n) {
    var o;
    const r = n == null ? void 0 : n.signal;
    r && (r.aborted && this.controller.abort(), r.addEventListener("abort", () => this.controller.abort()));
    const a = { ...t, stream: !0 }, i = await e.createAndRun(a, { ...n, signal: this.controller.signal });
    this._connected();
    for await (const c of i)
      v(this, X, "m", st).call(this, c);
    if ((o = i.controller.signal) != null && o.aborted)
      throw new se();
    return this._addRun(v(this, X, "m", rt).call(this));
  }
  async _createAssistantStream(e, t, n, r) {
    var c;
    const a = r == null ? void 0 : r.signal;
    a && (a.aborted && this.controller.abort(), a.addEventListener("abort", () => this.controller.abort()));
    const i = { ...n, stream: !0 }, o = await e.create(t, i, { ...r, signal: this.controller.signal });
    this._connected();
    for await (const l of o)
      v(this, X, "m", st).call(this, l);
    if ((c = o.controller.signal) != null && c.aborted)
      throw new se();
    return this._addRun(v(this, X, "m", rt).call(this));
  }
  static accumulateDelta(e, t) {
    for (const [n, r] of Object.entries(t)) {
      if (!e.hasOwnProperty(n)) {
        e[n] = r;
        continue;
      }
      let a = e[n];
      if (a == null) {
        e[n] = r;
        continue;
      }
      if (n === "index" || n === "type") {
        e[n] = r;
        continue;
      }
      if (typeof a == "string" && typeof r == "string")
        a += r;
      else if (typeof a == "number" && typeof r == "number")
        a += r;
      else if (un(a) && un(r))
        a = this.accumulateDelta(a, r);
      else if (Array.isArray(a) && Array.isArray(r)) {
        if (a.every((i) => typeof i == "string" || typeof i == "number")) {
          a.push(...r);
          continue;
        }
        for (const i of r) {
          if (!un(i))
            throw new Error(`Expected array delta entry to be an object but got: ${i}`);
          const o = i.index;
          if (o == null)
            throw console.error(i), new Error("Expected array delta entry to have an `index` property");
          if (typeof o != "number")
            throw new Error(`Expected array delta entry \`index\` property to be a number but got ${o}`);
          const c = a[o];
          c == null ? a.push(i) : a[o] = this.accumulateDelta(c, i);
        }
        continue;
      } else
        throw Error(`Unhandled record type: ${n}, deltaValue: ${r}, accValue: ${a}`);
      e[n] = a;
    }
    return e;
  }
  _addRun(e) {
    return e;
  }
  async _threadAssistantStream(e, t, n) {
    return await this._createThreadAssistantStream(t, e, n);
  }
  async _runAssistantStream(e, t, n, r) {
    return await this._createAssistantStream(t, e, n, r);
  }
  async _runToolAssistantStream(e, t, n, r, a) {
    return await this._createToolAssistantStream(n, e, t, r, a);
  }
}
st = function(e) {
  if (!this.ended)
    switch (K(this, Tt, e, "f"), v(this, X, "m", Xs).call(this, e), e.event) {
      case "thread.created":
        break;
      case "thread.run.created":
      case "thread.run.queued":
      case "thread.run.in_progress":
      case "thread.run.requires_action":
      case "thread.run.completed":
      case "thread.run.incomplete":
      case "thread.run.failed":
      case "thread.run.cancelling":
      case "thread.run.cancelled":
      case "thread.run.expired":
        v(this, X, "m", Ks).call(this, e);
        break;
      case "thread.run.step.created":
      case "thread.run.step.in_progress":
      case "thread.run.step.delta":
      case "thread.run.step.completed":
      case "thread.run.step.failed":
      case "thread.run.step.cancelled":
      case "thread.run.step.expired":
        v(this, X, "m", Hs).call(this, e);
        break;
      case "thread.message.created":
      case "thread.message.in_progress":
      case "thread.message.delta":
      case "thread.message.completed":
      case "thread.message.incomplete":
        v(this, X, "m", qs).call(this, e);
        break;
      case "error":
        throw new Error("Encountered an error event in event processing - errors should be processed earlier");
    }
}, rt = function() {
  if (this.ended)
    throw new A("stream has ended, this shouldn't happen");
  if (!v(this, Ee, "f"))
    throw Error("Final run has not been received");
  return v(this, Ee, "f");
}, qs = function(e) {
  const [t, n] = v(this, X, "m", Qs).call(this, e, v(this, ie, "f"));
  K(this, ie, t, "f"), v(this, $t, "f")[t.id] = t;
  for (const r of n) {
    const a = t.content[r.index];
    (a == null ? void 0 : a.type) == "text" && this._emit("textCreated", a.text);
  }
  switch (e.event) {
    case "thread.message.created":
      this._emit("messageCreated", e.data);
      break;
    case "thread.message.in_progress":
      break;
    case "thread.message.delta":
      if (this._emit("messageDelta", e.data.delta, t), e.data.delta.content)
        for (const r of e.data.delta.content) {
          if (r.type == "text" && r.text) {
            let a = r.text, i = t.content[r.index];
            if (i && i.type == "text")
              this._emit("textDelta", a, i.text);
            else
              throw Error("The snapshot associated with this text delta is not text or missing");
          }
          if (r.index != v(this, Ue, "f")) {
            if (v(this, Ie, "f"))
              switch (v(this, Ie, "f").type) {
                case "text":
                  this._emit("textDone", v(this, Ie, "f").text, v(this, ie, "f"));
                  break;
                case "image_file":
                  this._emit("imageFileDone", v(this, Ie, "f").image_file, v(this, ie, "f"));
                  break;
              }
            K(this, Ue, r.index, "f");
          }
          K(this, Ie, t.content[r.index], "f");
        }
      break;
    case "thread.message.completed":
    case "thread.message.incomplete":
      if (v(this, Ue, "f") !== void 0) {
        const r = e.data.content[v(this, Ue, "f")];
        if (r)
          switch (r.type) {
            case "image_file":
              this._emit("imageFileDone", r.image_file, v(this, ie, "f"));
              break;
            case "text":
              this._emit("textDone", r.text, v(this, ie, "f"));
              break;
          }
      }
      v(this, ie, "f") && this._emit("messageDone", e.data), K(this, ie, void 0, "f");
  }
}, Hs = function(e) {
  const t = v(this, X, "m", Gs).call(this, e);
  switch (K(this, it, t, "f"), e.event) {
    case "thread.run.step.created":
      this._emit("runStepCreated", e.data);
      break;
    case "thread.run.step.delta":
      const n = e.data.delta;
      if (n.step_details && n.step_details.type == "tool_calls" && n.step_details.tool_calls && t.step_details.type == "tool_calls")
        for (const a of n.step_details.tool_calls)
          a.index == v(this, Ut, "f") ? this._emit("toolCallDelta", a, t.step_details.tool_calls[a.index]) : (v(this, te, "f") && this._emit("toolCallDone", v(this, te, "f")), K(this, Ut, a.index, "f"), K(this, te, t.step_details.tool_calls[a.index], "f"), v(this, te, "f") && this._emit("toolCallCreated", v(this, te, "f")));
      this._emit("runStepDelta", e.data.delta, t);
      break;
    case "thread.run.step.completed":
    case "thread.run.step.failed":
    case "thread.run.step.cancelled":
    case "thread.run.step.expired":
      K(this, it, void 0, "f"), e.data.step_details.type == "tool_calls" && v(this, te, "f") && (this._emit("toolCallDone", v(this, te, "f")), K(this, te, void 0, "f")), this._emit("runStepDone", e.data, t);
      break;
  }
}, Xs = function(e) {
  v(this, Rn, "f").push(e), this._emit("event", e);
}, Gs = function(e) {
  switch (e.event) {
    case "thread.run.step.created":
      return v(this, ue, "f")[e.data.id] = e.data, e.data;
    case "thread.run.step.delta":
      let t = v(this, ue, "f")[e.data.id];
      if (!t)
        throw Error("Received a RunStepDelta before creation of a snapshot");
      let n = e.data;
      if (n.delta) {
        const r = oe.accumulateDelta(t, n.delta);
        v(this, ue, "f")[e.data.id] = r;
      }
      return v(this, ue, "f")[e.data.id];
    case "thread.run.step.completed":
    case "thread.run.step.failed":
    case "thread.run.step.cancelled":
    case "thread.run.step.expired":
    case "thread.run.step.in_progress":
      v(this, ue, "f")[e.data.id] = e.data;
      break;
  }
  if (v(this, ue, "f")[e.data.id])
    return v(this, ue, "f")[e.data.id];
  throw new Error("No snapshot available");
}, Qs = function(e, t) {
  let n = [];
  switch (e.event) {
    case "thread.message.created":
      return [e.data, n];
    case "thread.message.delta":
      if (!t)
        throw Error("Received a delta with no existing snapshot (there should be one from message creation)");
      let r = e.data;
      if (r.delta.content)
        for (const a of r.delta.content)
          if (a.index in t.content) {
            let i = t.content[a.index];
            t.content[a.index] = v(this, X, "m", Ys).call(this, a, i);
          } else
            t.content[a.index] = a, n.push(a);
      return [t, n];
    case "thread.message.in_progress":
    case "thread.message.completed":
    case "thread.message.incomplete":
      if (t)
        return [t, n];
      throw Error("Received thread message event with no existing snapshot");
  }
  throw Error("Tried to accumulate a non-message event");
}, Ys = function(e, t) {
  return oe.accumulateDelta(t, e);
}, Ks = function(e) {
  switch (K(this, Ot, e.data, "f"), e.event) {
    case "thread.run.created":
      break;
    case "thread.run.queued":
      break;
    case "thread.run.in_progress":
      break;
    case "thread.run.requires_action":
    case "thread.run.cancelled":
    case "thread.run.failed":
    case "thread.run.completed":
    case "thread.run.expired":
      K(this, Ee, e.data, "f"), v(this, te, "f") && (this._emit("toolCallDone", v(this, te, "f")), K(this, te, void 0, "f"));
      break;
  }
};
class Wn extends C {
  /**
   * Create an assistant with a model and instructions.
   *
   * @example
   * ```ts
   * const assistant = await client.beta.assistants.create({
   *   model: 'gpt-4o',
   * });
   * ```
   */
  create(e, t) {
    return this._client.post("/assistants", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Retrieves an assistant.
   *
   * @example
   * ```ts
   * const assistant = await client.beta.assistants.retrieve(
   *   'assistant_id',
   * );
   * ```
   */
  retrieve(e, t) {
    return this._client.get(`/assistants/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Modifies an assistant.
   *
   * @example
   * ```ts
   * const assistant = await client.beta.assistants.update(
   *   'assistant_id',
   * );
   * ```
   */
  update(e, t, n) {
    return this._client.post(`/assistants/${e}`, {
      body: t,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  list(e = {}, t) {
    return W(e) ? this.list({}, e) : this._client.getAPIList("/assistants", Vn, {
      query: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Delete an assistant.
   *
   * @example
   * ```ts
   * const assistantDeleted = await client.beta.assistants.del(
   *   'assistant_id',
   * );
   * ```
   */
  del(e, t) {
    return this._client.delete(`/assistants/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
}
class Vn extends z {
}
Wn.AssistantsPage = Vn;
function er(s) {
  return typeof s.parse == "function";
}
const We = (s) => (s == null ? void 0 : s.role) === "assistant", Yr = (s) => (s == null ? void 0 : s.role) === "function", Kr = (s) => (s == null ? void 0 : s.role) === "tool";
function Zn(s) {
  return (s == null ? void 0 : s.$brand) === "auto-parseable-response-format";
}
function mt(s) {
  return (s == null ? void 0 : s.$brand) === "auto-parseable-tool";
}
function to(s, e) {
  return !e || !ea(e) ? {
    ...s,
    choices: s.choices.map((t) => ({
      ...t,
      message: {
        ...t.message,
        parsed: null,
        ...t.message.tool_calls ? {
          tool_calls: t.message.tool_calls
        } : void 0
      }
    }))
  } : Jn(s, e);
}
function Jn(s, e) {
  const t = s.choices.map((n) => {
    var r;
    if (n.finish_reason === "length")
      throw new Nr();
    if (n.finish_reason === "content_filter")
      throw new Mr();
    return {
      ...n,
      message: {
        ...n.message,
        ...n.message.tool_calls ? {
          tool_calls: ((r = n.message.tool_calls) == null ? void 0 : r.map((a) => so(e, a))) ?? void 0
        } : void 0,
        parsed: n.message.content && !n.message.refusal ? no(e, n.message.content) : null
      }
    };
  });
  return { ...s, choices: t };
}
function no(s, e) {
  var t, n;
  return ((t = s.response_format) == null ? void 0 : t.type) !== "json_schema" ? null : ((n = s.response_format) == null ? void 0 : n.type) === "json_schema" ? "$parseRaw" in s.response_format ? s.response_format.$parseRaw(e) : JSON.parse(e) : null;
}
function so(s, e) {
  var n;
  const t = (n = s.tools) == null ? void 0 : n.find((r) => {
    var a;
    return ((a = r.function) == null ? void 0 : a.name) === e.function.name;
  });
  return {
    ...e,
    function: {
      ...e.function,
      parsed_arguments: mt(t) ? t.$parseRaw(e.function.arguments) : t != null && t.function.strict ? JSON.parse(e.function.arguments) : null
    }
  };
}
function ro(s, e) {
  var n;
  if (!s)
    return !1;
  const t = (n = s.tools) == null ? void 0 : n.find((r) => {
    var a;
    return ((a = r.function) == null ? void 0 : a.name) === e.function.name;
  });
  return mt(t) || (t == null ? void 0 : t.function.strict) || !1;
}
function ea(s) {
  var e;
  return Zn(s.response_format) ? !0 : ((e = s.tools) == null ? void 0 : e.some((t) => mt(t) || t.type === "function" && t.function.strict === !0)) ?? !1;
}
function ao(s) {
  for (const e of s ?? []) {
    if (e.type !== "function")
      throw new A(`Currently only \`function\` tool types support auto-parsing; Received \`${e.type}\``);
    if (e.function.strict !== !0)
      throw new A(`The \`${e.function.name}\` tool is not marked with \`strict: true\`. Only strict function tools can be auto-parsed`);
  }
}
var Y = function(s, e, t, n) {
  if (t === "a" && !n) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? n : t === "a" ? n.call(s) : n ? n.value : e.get(s);
}, Q, In, Wt, En, $n, Tn, ta, On;
const tr = 10;
class na extends Un {
  constructor() {
    super(...arguments), Q.add(this), this._chatCompletions = [], this.messages = [];
  }
  _addChatCompletion(e) {
    var n;
    this._chatCompletions.push(e), this._emit("chatCompletion", e);
    const t = (n = e.choices[0]) == null ? void 0 : n.message;
    return t && this._addMessage(t), e;
  }
  _addMessage(e, t = !0) {
    if ("content" in e || (e.content = null), this.messages.push(e), t) {
      if (this._emit("message", e), (Yr(e) || Kr(e)) && e.content)
        this._emit("functionCallResult", e.content);
      else if (We(e) && e.function_call)
        this._emit("functionCall", e.function_call);
      else if (We(e) && e.tool_calls)
        for (const n of e.tool_calls)
          n.type === "function" && this._emit("functionCall", n.function);
    }
  }
  /**
   * @returns a promise that resolves with the final ChatCompletion, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletion.
   */
  async finalChatCompletion() {
    await this.done();
    const e = this._chatCompletions[this._chatCompletions.length - 1];
    if (!e)
      throw new A("stream ended without producing a ChatCompletion");
    return e;
  }
  /**
   * @returns a promise that resolves with the content of the final ChatCompletionMessage, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  async finalContent() {
    return await this.done(), Y(this, Q, "m", In).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant ChatCompletionMessage response,
   * or rejects if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  async finalMessage() {
    return await this.done(), Y(this, Q, "m", Wt).call(this);
  }
  /**
   * @returns a promise that resolves with the content of the final FunctionCall, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  async finalFunctionCall() {
    return await this.done(), Y(this, Q, "m", En).call(this);
  }
  async finalFunctionCallResult() {
    return await this.done(), Y(this, Q, "m", $n).call(this);
  }
  async totalUsage() {
    return await this.done(), Y(this, Q, "m", Tn).call(this);
  }
  allChatCompletions() {
    return [...this._chatCompletions];
  }
  _emitFinal() {
    const e = this._chatCompletions[this._chatCompletions.length - 1];
    e && this._emit("finalChatCompletion", e);
    const t = Y(this, Q, "m", Wt).call(this);
    t && this._emit("finalMessage", t);
    const n = Y(this, Q, "m", In).call(this);
    n && this._emit("finalContent", n);
    const r = Y(this, Q, "m", En).call(this);
    r && this._emit("finalFunctionCall", r);
    const a = Y(this, Q, "m", $n).call(this);
    a != null && this._emit("finalFunctionCallResult", a), this._chatCompletions.some((i) => i.usage) && this._emit("totalUsage", Y(this, Q, "m", Tn).call(this));
  }
  async _createChatCompletion(e, t, n) {
    const r = n == null ? void 0 : n.signal;
    r && (r.aborted && this.controller.abort(), r.addEventListener("abort", () => this.controller.abort())), Y(this, Q, "m", ta).call(this, t);
    const a = await e.chat.completions.create({ ...t, stream: !1 }, { ...n, signal: this.controller.signal });
    return this._connected(), this._addChatCompletion(Jn(a, t));
  }
  async _runChatCompletion(e, t, n) {
    for (const r of t.messages)
      this._addMessage(r, !1);
    return await this._createChatCompletion(e, t, n);
  }
  async _runFunctions(e, t, n) {
    var f;
    const r = "function", { function_call: a = "auto", stream: i, ...o } = t, c = typeof a != "string" && (a == null ? void 0 : a.name), { maxChatCompletions: l = tr } = n || {}, d = {};
    for (const g of t.functions)
      d[g.name || g.function.name] = g;
    const u = t.functions.map((g) => ({
      name: g.name || g.function.name,
      parameters: g.parameters,
      description: g.description
    }));
    for (const g of t.messages)
      this._addMessage(g, !1);
    for (let g = 0; g < l; ++g) {
      const y = (f = (await this._createChatCompletion(e, {
        ...o,
        function_call: a,
        functions: u,
        messages: [...this.messages]
      }, n)).choices[0]) == null ? void 0 : f.message;
      if (!y)
        throw new A("missing message in ChatCompletion response");
      if (!y.function_call)
        return;
      const { name: p, arguments: E } = y.function_call, m = d[p];
      if (m) {
        if (c && c !== p) {
          const O = `Invalid function_call: ${JSON.stringify(p)}. ${JSON.stringify(c)} requested. Please try again`;
          this._addMessage({ role: r, name: p, content: O });
          continue;
        }
      } else {
        const O = `Invalid function_call: ${JSON.stringify(p)}. Available options are: ${u.map(($) => JSON.stringify($.name)).join(", ")}. Please try again`;
        this._addMessage({ role: r, name: p, content: O });
        continue;
      }
      let k;
      try {
        k = er(m) ? await m.parse(E) : E;
      } catch (O) {
        this._addMessage({
          role: r,
          name: p,
          content: O instanceof Error ? O.message : String(O)
        });
        continue;
      }
      const S = await m.function(k, this), D = Y(this, Q, "m", On).call(this, S);
      if (this._addMessage({ role: r, name: p, content: D }), c)
        return;
    }
  }
  async _runTools(e, t, n) {
    var g, x, y;
    const r = "tool", { tool_choice: a = "auto", stream: i, ...o } = t, c = typeof a != "string" && ((g = a == null ? void 0 : a.function) == null ? void 0 : g.name), { maxChatCompletions: l = tr } = n || {}, d = t.tools.map((p) => {
      if (mt(p)) {
        if (!p.$callback)
          throw new A("Tool given to `.runTools()` that does not have an associated function");
        return {
          type: "function",
          function: {
            function: p.$callback,
            name: p.function.name,
            description: p.function.description || "",
            parameters: p.function.parameters,
            parse: p.$parseRaw,
            strict: !0
          }
        };
      }
      return p;
    }), u = {};
    for (const p of d)
      p.type === "function" && (u[p.function.name || p.function.function.name] = p.function);
    const f = "tools" in t ? d.map((p) => p.type === "function" ? {
      type: "function",
      function: {
        name: p.function.name || p.function.function.name,
        parameters: p.function.parameters,
        description: p.function.description,
        strict: p.function.strict
      }
    } : p) : void 0;
    for (const p of t.messages)
      this._addMessage(p, !1);
    for (let p = 0; p < l; ++p) {
      const m = (x = (await this._createChatCompletion(e, {
        ...o,
        tool_choice: a,
        tools: f,
        messages: [...this.messages]
      }, n)).choices[0]) == null ? void 0 : x.message;
      if (!m)
        throw new A("missing message in ChatCompletion response");
      if (!((y = m.tool_calls) != null && y.length))
        return;
      for (const k of m.tool_calls) {
        if (k.type !== "function")
          continue;
        const S = k.id, { name: D, arguments: O } = k.function, $ = u[D];
        if ($) {
          if (c && c !== D) {
            const L = `Invalid tool_call: ${JSON.stringify(D)}. ${JSON.stringify(c)} requested. Please try again`;
            this._addMessage({ role: r, tool_call_id: S, content: L });
            continue;
          }
        } else {
          const L = `Invalid tool_call: ${JSON.stringify(D)}. Available options are: ${Object.keys(u).map((Oe) => JSON.stringify(Oe)).join(", ")}. Please try again`;
          this._addMessage({ role: r, tool_call_id: S, content: L });
          continue;
        }
        let q;
        try {
          q = er($) ? await $.parse(O) : O;
        } catch (L) {
          const Oe = L instanceof Error ? L.message : String(L);
          this._addMessage({ role: r, tool_call_id: S, content: Oe });
          continue;
        }
        const j = await $.function(q, this), B = Y(this, Q, "m", On).call(this, j);
        if (this._addMessage({ role: r, tool_call_id: S, content: B }), c)
          return;
      }
    }
  }
}
Q = /* @__PURE__ */ new WeakSet(), In = function() {
  return Y(this, Q, "m", Wt).call(this).content ?? null;
}, Wt = function() {
  let e = this.messages.length;
  for (; e-- > 0; ) {
    const t = this.messages[e];
    if (We(t)) {
      const { function_call: n, ...r } = t, a = {
        ...r,
        content: t.content ?? null,
        refusal: t.refusal ?? null
      };
      return n && (a.function_call = n), a;
    }
  }
  throw new A("stream ended without producing a ChatCompletionMessage with role=assistant");
}, En = function() {
  var e, t;
  for (let n = this.messages.length - 1; n >= 0; n--) {
    const r = this.messages[n];
    if (We(r) && (r != null && r.function_call))
      return r.function_call;
    if (We(r) && ((e = r == null ? void 0 : r.tool_calls) != null && e.length))
      return (t = r.tool_calls.at(-1)) == null ? void 0 : t.function;
  }
}, $n = function() {
  for (let e = this.messages.length - 1; e >= 0; e--) {
    const t = this.messages[e];
    if (Yr(t) && t.content != null || Kr(t) && t.content != null && typeof t.content == "string" && this.messages.some((n) => {
      var r;
      return n.role === "assistant" && ((r = n.tool_calls) == null ? void 0 : r.some((a) => a.type === "function" && a.id === t.tool_call_id));
    }))
      return t.content;
  }
}, Tn = function() {
  const e = {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0
  };
  for (const { usage: t } of this._chatCompletions)
    t && (e.completion_tokens += t.completion_tokens, e.prompt_tokens += t.prompt_tokens, e.total_tokens += t.total_tokens);
  return e;
}, ta = function(e) {
  if (e.n != null && e.n > 1)
    throw new A("ChatCompletion convenience helpers only support n=1 at this time. To use n>1, please use chat.completions.create() directly.");
}, On = function(e) {
  return typeof e == "string" ? e : e === void 0 ? "undefined" : JSON.stringify(e);
};
class ut extends na {
  /** @deprecated - please use `runTools` instead. */
  static runFunctions(e, t, n) {
    const r = new ut(), a = {
      ...n,
      headers: { ...n == null ? void 0 : n.headers, "X-Stainless-Helper-Method": "runFunctions" }
    };
    return r._run(() => r._runFunctions(e, t, a)), r;
  }
  static runTools(e, t, n) {
    const r = new ut(), a = {
      ...n,
      headers: { ...n == null ? void 0 : n.headers, "X-Stainless-Helper-Method": "runTools" }
    };
    return r._run(() => r._runTools(e, t, a)), r;
  }
  _addMessage(e, t = !0) {
    super._addMessage(e, t), We(e) && e.content && this._emit("content", e.content);
  }
}
const sa = 1, ra = 2, aa = 4, ia = 8, oa = 16, ca = 32, la = 64, ua = 128, da = 256, ha = ua | da, fa = oa | ca | ha | la, ma = sa | ra | fa, pa = aa | ia, io = ma | pa, H = {
  STR: sa,
  NUM: ra,
  ARR: aa,
  OBJ: ia,
  NULL: oa,
  BOOL: ca,
  NAN: la,
  INFINITY: ua,
  MINUS_INFINITY: da,
  INF: ha,
  SPECIAL: fa,
  ATOM: ma,
  COLLECTION: pa,
  ALL: io
};
class oo extends Error {
}
class co extends Error {
}
function lo(s, e = H.ALL) {
  if (typeof s != "string")
    throw new TypeError(`expecting str, got ${typeof s}`);
  if (!s.trim())
    throw new Error(`${s} is empty`);
  return uo(s.trim(), e);
}
const uo = (s, e) => {
  const t = s.length;
  let n = 0;
  const r = (f) => {
    throw new oo(`${f} at position ${n}`);
  }, a = (f) => {
    throw new co(`${f} at position ${n}`);
  }, i = () => (u(), n >= t && r("Unexpected end of input"), s[n] === '"' ? o() : s[n] === "{" ? c() : s[n] === "[" ? l() : s.substring(n, n + 4) === "null" || H.NULL & e && t - n < 4 && "null".startsWith(s.substring(n)) ? (n += 4, null) : s.substring(n, n + 4) === "true" || H.BOOL & e && t - n < 4 && "true".startsWith(s.substring(n)) ? (n += 4, !0) : s.substring(n, n + 5) === "false" || H.BOOL & e && t - n < 5 && "false".startsWith(s.substring(n)) ? (n += 5, !1) : s.substring(n, n + 8) === "Infinity" || H.INFINITY & e && t - n < 8 && "Infinity".startsWith(s.substring(n)) ? (n += 8, 1 / 0) : s.substring(n, n + 9) === "-Infinity" || H.MINUS_INFINITY & e && 1 < t - n && t - n < 9 && "-Infinity".startsWith(s.substring(n)) ? (n += 9, -1 / 0) : s.substring(n, n + 3) === "NaN" || H.NAN & e && t - n < 3 && "NaN".startsWith(s.substring(n)) ? (n += 3, NaN) : d()), o = () => {
    const f = n;
    let g = !1;
    for (n++; n < t && (s[n] !== '"' || g && s[n - 1] === "\\"); )
      g = s[n] === "\\" ? !g : !1, n++;
    if (s.charAt(n) == '"')
      try {
        return JSON.parse(s.substring(f, ++n - Number(g)));
      } catch (x) {
        a(String(x));
      }
    else if (H.STR & e)
      try {
        return JSON.parse(s.substring(f, n - Number(g)) + '"');
      } catch {
        return JSON.parse(s.substring(f, s.lastIndexOf("\\")) + '"');
      }
    r("Unterminated string literal");
  }, c = () => {
    n++, u();
    const f = {};
    try {
      for (; s[n] !== "}"; ) {
        if (u(), n >= t && H.OBJ & e)
          return f;
        const g = o();
        u(), n++;
        try {
          const x = i();
          Object.defineProperty(f, g, { value: x, writable: !0, enumerable: !0, configurable: !0 });
        } catch (x) {
          if (H.OBJ & e)
            return f;
          throw x;
        }
        u(), s[n] === "," && n++;
      }
    } catch {
      if (H.OBJ & e)
        return f;
      r("Expected '}' at end of object");
    }
    return n++, f;
  }, l = () => {
    n++;
    const f = [];
    try {
      for (; s[n] !== "]"; )
        f.push(i()), u(), s[n] === "," && n++;
    } catch {
      if (H.ARR & e)
        return f;
      r("Expected ']' at end of array");
    }
    return n++, f;
  }, d = () => {
    if (n === 0) {
      s === "-" && H.NUM & e && r("Not sure what '-' is");
      try {
        return JSON.parse(s);
      } catch (g) {
        if (H.NUM & e)
          try {
            return s[s.length - 1] === "." ? JSON.parse(s.substring(0, s.lastIndexOf("."))) : JSON.parse(s.substring(0, s.lastIndexOf("e")));
          } catch {
          }
        a(String(g));
      }
    }
    const f = n;
    for (s[n] === "-" && n++; s[n] && !",]}".includes(s[n]); )
      n++;
    n == t && !(H.NUM & e) && r("Unterminated number literal");
    try {
      return JSON.parse(s.substring(f, n));
    } catch {
      s.substring(f, n) === "-" && H.NUM & e && r("Not sure what '-' is");
      try {
        return JSON.parse(s.substring(f, s.lastIndexOf("e")));
      } catch (x) {
        a(String(x));
      }
    }
  }, u = () => {
    for (; n < t && ` 
\r	`.includes(s[n]); )
      n++;
  };
  return i();
}, nr = (s) => lo(s, H.ALL ^ H.NUM);
var Fe = function(s, e, t, n, r) {
  if (n === "m") throw new TypeError("Private method is not writable");
  if (n === "a" && !r) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return n === "a" ? r.call(s, t) : r ? r.value = t : e.set(s, t), t;
}, M = function(s, e, t, n) {
  if (t === "a" && !n) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? n : t === "a" ? n.call(s) : n ? n.value : e.get(s);
}, Z, fe, Ne, ge, dn, St, hn, fn, mn, At, pn, sr;
class dt extends na {
  constructor(e) {
    super(), Z.add(this), fe.set(this, void 0), Ne.set(this, void 0), ge.set(this, void 0), Fe(this, fe, e, "f"), Fe(this, Ne, [], "f");
  }
  get currentChatCompletionSnapshot() {
    return M(this, ge, "f");
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(e) {
    const t = new dt(null);
    return t._run(() => t._fromReadableStream(e)), t;
  }
  static createChatCompletion(e, t, n) {
    const r = new dt(t);
    return r._run(() => r._runChatCompletion(e, { ...t, stream: !0 }, { ...n, headers: { ...n == null ? void 0 : n.headers, "X-Stainless-Helper-Method": "stream" } })), r;
  }
  async _createChatCompletion(e, t, n) {
    var i;
    super._createChatCompletion;
    const r = n == null ? void 0 : n.signal;
    r && (r.aborted && this.controller.abort(), r.addEventListener("abort", () => this.controller.abort())), M(this, Z, "m", dn).call(this);
    const a = await e.chat.completions.create({ ...t, stream: !0 }, { ...n, signal: this.controller.signal });
    this._connected();
    for await (const o of a)
      M(this, Z, "m", hn).call(this, o);
    if ((i = a.controller.signal) != null && i.aborted)
      throw new se();
    return this._addChatCompletion(M(this, Z, "m", At).call(this));
  }
  async _fromReadableStream(e, t) {
    var i;
    const n = t == null ? void 0 : t.signal;
    n && (n.aborted && this.controller.abort(), n.addEventListener("abort", () => this.controller.abort())), M(this, Z, "m", dn).call(this), this._connected();
    const r = de.fromReadableStream(e, this.controller);
    let a;
    for await (const o of r)
      a && a !== o.id && this._addChatCompletion(M(this, Z, "m", At).call(this)), M(this, Z, "m", hn).call(this, o), a = o.id;
    if ((i = r.controller.signal) != null && i.aborted)
      throw new se();
    return this._addChatCompletion(M(this, Z, "m", At).call(this));
  }
  [(fe = /* @__PURE__ */ new WeakMap(), Ne = /* @__PURE__ */ new WeakMap(), ge = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakSet(), dn = function() {
    this.ended || Fe(this, ge, void 0, "f");
  }, St = function(t) {
    let n = M(this, Ne, "f")[t.index];
    return n || (n = {
      content_done: !1,
      refusal_done: !1,
      logprobs_content_done: !1,
      logprobs_refusal_done: !1,
      done_tool_calls: /* @__PURE__ */ new Set(),
      current_tool_call_index: null
    }, M(this, Ne, "f")[t.index] = n, n);
  }, hn = function(t) {
    var r, a, i, o, c, l, d, u, f, g, x, y, p, E, m;
    if (this.ended)
      return;
    const n = M(this, Z, "m", sr).call(this, t);
    this._emit("chunk", t, n);
    for (const k of t.choices) {
      const S = n.choices[k.index];
      k.delta.content != null && ((r = S.message) == null ? void 0 : r.role) === "assistant" && ((a = S.message) != null && a.content) && (this._emit("content", k.delta.content, S.message.content), this._emit("content.delta", {
        delta: k.delta.content,
        snapshot: S.message.content,
        parsed: S.message.parsed
      })), k.delta.refusal != null && ((i = S.message) == null ? void 0 : i.role) === "assistant" && ((o = S.message) != null && o.refusal) && this._emit("refusal.delta", {
        delta: k.delta.refusal,
        snapshot: S.message.refusal
      }), ((c = k.logprobs) == null ? void 0 : c.content) != null && ((l = S.message) == null ? void 0 : l.role) === "assistant" && this._emit("logprobs.content.delta", {
        content: (d = k.logprobs) == null ? void 0 : d.content,
        snapshot: ((u = S.logprobs) == null ? void 0 : u.content) ?? []
      }), ((f = k.logprobs) == null ? void 0 : f.refusal) != null && ((g = S.message) == null ? void 0 : g.role) === "assistant" && this._emit("logprobs.refusal.delta", {
        refusal: (x = k.logprobs) == null ? void 0 : x.refusal,
        snapshot: ((y = S.logprobs) == null ? void 0 : y.refusal) ?? []
      });
      const D = M(this, Z, "m", St).call(this, S);
      S.finish_reason && (M(this, Z, "m", mn).call(this, S), D.current_tool_call_index != null && M(this, Z, "m", fn).call(this, S, D.current_tool_call_index));
      for (const O of k.delta.tool_calls ?? [])
        D.current_tool_call_index !== O.index && (M(this, Z, "m", mn).call(this, S), D.current_tool_call_index != null && M(this, Z, "m", fn).call(this, S, D.current_tool_call_index)), D.current_tool_call_index = O.index;
      for (const O of k.delta.tool_calls ?? []) {
        const $ = (p = S.message.tool_calls) == null ? void 0 : p[O.index];
        $ != null && $.type && (($ == null ? void 0 : $.type) === "function" ? this._emit("tool_calls.function.arguments.delta", {
          name: (E = $.function) == null ? void 0 : E.name,
          index: O.index,
          arguments: $.function.arguments,
          parsed_arguments: $.function.parsed_arguments,
          arguments_delta: ((m = O.function) == null ? void 0 : m.arguments) ?? ""
        }) : ($ == null || $.type, void 0));
      }
    }
  }, fn = function(t, n) {
    var i, o, c;
    if (M(this, Z, "m", St).call(this, t).done_tool_calls.has(n))
      return;
    const a = (i = t.message.tool_calls) == null ? void 0 : i[n];
    if (!a)
      throw new Error("no tool call snapshot");
    if (!a.type)
      throw new Error("tool call snapshot missing `type`");
    if (a.type === "function") {
      const l = (c = (o = M(this, fe, "f")) == null ? void 0 : o.tools) == null ? void 0 : c.find((d) => d.type === "function" && d.function.name === a.function.name);
      this._emit("tool_calls.function.arguments.done", {
        name: a.function.name,
        index: n,
        arguments: a.function.arguments,
        parsed_arguments: mt(l) ? l.$parseRaw(a.function.arguments) : l != null && l.function.strict ? JSON.parse(a.function.arguments) : null
      });
    } else
      a.type;
  }, mn = function(t) {
    var r, a;
    const n = M(this, Z, "m", St).call(this, t);
    if (t.message.content && !n.content_done) {
      n.content_done = !0;
      const i = M(this, Z, "m", pn).call(this);
      this._emit("content.done", {
        content: t.message.content,
        parsed: i ? i.$parseRaw(t.message.content) : null
      });
    }
    t.message.refusal && !n.refusal_done && (n.refusal_done = !0, this._emit("refusal.done", { refusal: t.message.refusal })), (r = t.logprobs) != null && r.content && !n.logprobs_content_done && (n.logprobs_content_done = !0, this._emit("logprobs.content.done", { content: t.logprobs.content })), (a = t.logprobs) != null && a.refusal && !n.logprobs_refusal_done && (n.logprobs_refusal_done = !0, this._emit("logprobs.refusal.done", { refusal: t.logprobs.refusal }));
  }, At = function() {
    if (this.ended)
      throw new A("stream has ended, this shouldn't happen");
    const t = M(this, ge, "f");
    if (!t)
      throw new A("request ended without sending any chunks");
    return Fe(this, ge, void 0, "f"), Fe(this, Ne, [], "f"), ho(t, M(this, fe, "f"));
  }, pn = function() {
    var n;
    const t = (n = M(this, fe, "f")) == null ? void 0 : n.response_format;
    return Zn(t) ? t : null;
  }, sr = function(t) {
    var n, r, a, i;
    let o = M(this, ge, "f");
    const { choices: c, ...l } = t;
    o ? Object.assign(o, l) : o = Fe(this, ge, {
      ...l,
      choices: []
    }, "f");
    for (const { delta: d, finish_reason: u, index: f, logprobs: g = null, ...x } of t.choices) {
      let y = o.choices[f];
      if (y || (y = o.choices[f] = { finish_reason: u, index: f, message: {}, logprobs: g, ...x }), g)
        if (!y.logprobs)
          y.logprobs = Object.assign({}, g);
        else {
          const { content: O, refusal: $, ...q } = g;
          Object.assign(y.logprobs, q), O && ((n = y.logprobs).content ?? (n.content = []), y.logprobs.content.push(...O)), $ && ((r = y.logprobs).refusal ?? (r.refusal = []), y.logprobs.refusal.push(...$));
        }
      if (u && (y.finish_reason = u, M(this, fe, "f") && ea(M(this, fe, "f")))) {
        if (u === "length")
          throw new Nr();
        if (u === "content_filter")
          throw new Mr();
      }
      if (Object.assign(y, x), !d)
        continue;
      const { content: p, refusal: E, function_call: m, role: k, tool_calls: S, ...D } = d;
      if (Object.assign(y.message, D), E && (y.message.refusal = (y.message.refusal || "") + E), k && (y.message.role = k), m && (y.message.function_call ? (m.name && (y.message.function_call.name = m.name), m.arguments && ((a = y.message.function_call).arguments ?? (a.arguments = ""), y.message.function_call.arguments += m.arguments)) : y.message.function_call = m), p && (y.message.content = (y.message.content || "") + p, !y.message.refusal && M(this, Z, "m", pn).call(this) && (y.message.parsed = nr(y.message.content))), S) {
        y.message.tool_calls || (y.message.tool_calls = []);
        for (const { index: O, id: $, type: q, function: j, ...B } of S) {
          const L = (i = y.message.tool_calls)[O] ?? (i[O] = {});
          Object.assign(L, B), $ && (L.id = $), q && (L.type = q), j && (L.function ?? (L.function = { name: j.name ?? "", arguments: "" })), j != null && j.name && (L.function.name = j.name), j != null && j.arguments && (L.function.arguments += j.arguments, ro(M(this, fe, "f"), L) && (L.function.parsed_arguments = nr(L.function.arguments)));
        }
      }
    }
    return o;
  }, Symbol.asyncIterator)]() {
    const e = [], t = [];
    let n = !1;
    return this.on("chunk", (r) => {
      const a = t.shift();
      a ? a.resolve(r) : e.push(r);
    }), this.on("end", () => {
      n = !0;
      for (const r of t)
        r.resolve(void 0);
      t.length = 0;
    }), this.on("abort", (r) => {
      n = !0;
      for (const a of t)
        a.reject(r);
      t.length = 0;
    }), this.on("error", (r) => {
      n = !0;
      for (const a of t)
        a.reject(r);
      t.length = 0;
    }), {
      next: async () => e.length ? { value: e.shift(), done: !1 } : n ? { value: void 0, done: !0 } : new Promise((a, i) => t.push({ resolve: a, reject: i })).then((a) => a ? { value: a, done: !1 } : { value: void 0, done: !0 }),
      return: async () => (this.abort(), { value: void 0, done: !0 })
    };
  }
  toReadableStream() {
    return new de(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
}
function ho(s, e) {
  const { id: t, choices: n, created: r, model: a, system_fingerprint: i, ...o } = s, c = {
    ...o,
    id: t,
    choices: n.map(({ message: l, finish_reason: d, index: u, logprobs: f, ...g }) => {
      if (!d)
        throw new A(`missing finish_reason for choice ${u}`);
      const { content: x = null, function_call: y, tool_calls: p, ...E } = l, m = l.role;
      if (!m)
        throw new A(`missing role for choice ${u}`);
      if (y) {
        const { arguments: k, name: S } = y;
        if (k == null)
          throw new A(`missing function_call.arguments for choice ${u}`);
        if (!S)
          throw new A(`missing function_call.name for choice ${u}`);
        return {
          ...g,
          message: {
            content: x,
            function_call: { arguments: k, name: S },
            role: m,
            refusal: l.refusal ?? null
          },
          finish_reason: d,
          index: u,
          logprobs: f
        };
      }
      return p ? {
        ...g,
        index: u,
        finish_reason: d,
        logprobs: f,
        message: {
          ...E,
          role: m,
          content: x,
          refusal: l.refusal ?? null,
          tool_calls: p.map((k, S) => {
            const { function: D, type: O, id: $, ...q } = k, { arguments: j, name: B, ...L } = D || {};
            if ($ == null)
              throw new A(`missing choices[${u}].tool_calls[${S}].id
${kt(s)}`);
            if (O == null)
              throw new A(`missing choices[${u}].tool_calls[${S}].type
${kt(s)}`);
            if (B == null)
              throw new A(`missing choices[${u}].tool_calls[${S}].function.name
${kt(s)}`);
            if (j == null)
              throw new A(`missing choices[${u}].tool_calls[${S}].function.arguments
${kt(s)}`);
            return { ...q, id: $, type: O, function: { ...L, name: B, arguments: j } };
          })
        }
      } : {
        ...g,
        message: { ...E, content: x, role: m, refusal: l.refusal ?? null },
        finish_reason: d,
        index: u,
        logprobs: f
      };
    }),
    created: r,
    model: a,
    object: "chat.completion",
    ...i ? { system_fingerprint: i } : {}
  };
  return to(c, e);
}
function kt(s) {
  return JSON.stringify(s);
}
class Ve extends dt {
  static fromReadableStream(e) {
    const t = new Ve(null);
    return t._run(() => t._fromReadableStream(e)), t;
  }
  /** @deprecated - please use `runTools` instead. */
  static runFunctions(e, t, n) {
    const r = new Ve(null), a = {
      ...n,
      headers: { ...n == null ? void 0 : n.headers, "X-Stainless-Helper-Method": "runFunctions" }
    };
    return r._run(() => r._runFunctions(e, t, a)), r;
  }
  static runTools(e, t, n) {
    const r = new Ve(
      // @ts-expect-error TODO these types are incompatible
      t
    ), a = {
      ...n,
      headers: { ...n == null ? void 0 : n.headers, "X-Stainless-Helper-Method": "runTools" }
    };
    return r._run(() => r._runTools(e, t, a)), r;
  }
}
let ga = class extends C {
  parse(e, t) {
    return ao(e.tools), this._client.chat.completions.create(e, {
      ...t,
      headers: {
        ...t == null ? void 0 : t.headers,
        "X-Stainless-Helper-Method": "beta.chat.completions.parse"
      }
    })._thenUnwrap((n) => Jn(n, e));
  }
  runFunctions(e, t) {
    return e.stream ? Ve.runFunctions(this._client, e, t) : ut.runFunctions(this._client, e, t);
  }
  runTools(e, t) {
    return e.stream ? Ve.runTools(this._client, e, t) : ut.runTools(this._client, e, t);
  }
  /**
   * Creates a chat completion stream
   */
  stream(e, t) {
    return dt.createChatCompletion(this._client, e, t);
  }
};
class Fn extends C {
  constructor() {
    super(...arguments), this.completions = new ga(this._client);
  }
}
(function(s) {
  s.Completions = ga;
})(Fn || (Fn = {}));
class _a extends C {
  /**
   * Create an ephemeral API token for use in client-side applications with the
   * Realtime API. Can be configured with the same session parameters as the
   * `session.update` client event.
   *
   * It responds with a session object, plus a `client_secret` key which contains a
   * usable ephemeral API token that can be used to authenticate browser clients for
   * the Realtime API.
   *
   * @example
   * ```ts
   * const session =
   *   await client.beta.realtime.sessions.create();
   * ```
   */
  create(e, t) {
    return this._client.post("/realtime/sessions", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
}
class ya extends C {
  /**
   * Create an ephemeral API token for use in client-side applications with the
   * Realtime API specifically for realtime transcriptions. Can be configured with
   * the same session parameters as the `transcription_session.update` client event.
   *
   * It responds with a session object, plus a `client_secret` key which contains a
   * usable ephemeral API token that can be used to authenticate browser clients for
   * the Realtime API.
   *
   * @example
   * ```ts
   * const transcriptionSession =
   *   await client.beta.realtime.transcriptionSessions.create();
   * ```
   */
  create(e, t) {
    return this._client.post("/realtime/transcription_sessions", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
}
class Qt extends C {
  constructor() {
    super(...arguments), this.sessions = new _a(this._client), this.transcriptionSessions = new ya(this._client);
  }
}
Qt.Sessions = _a;
Qt.TranscriptionSessions = ya;
class zn extends C {
  /**
   * Create a message.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  create(e, t, n) {
    return this._client.post(`/threads/${e}/messages`, {
      body: t,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Retrieve a message.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  retrieve(e, t, n) {
    return this._client.get(`/threads/${e}/messages/${t}`, {
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Modifies a message.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  update(e, t, n, r) {
    return this._client.post(`/threads/${e}/messages/${t}`, {
      body: n,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r == null ? void 0 : r.headers }
    });
  }
  list(e, t = {}, n) {
    return W(t) ? this.list(e, {}, t) : this._client.getAPIList(`/threads/${e}/messages`, qn, {
      query: t,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Deletes a message.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  del(e, t, n) {
    return this._client.delete(`/threads/${e}/messages/${t}`, {
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
}
class qn extends z {
}
zn.MessagesPage = qn;
class Hn extends C {
  retrieve(e, t, n, r = {}, a) {
    return W(r) ? this.retrieve(e, t, n, {}, r) : this._client.get(`/threads/${e}/runs/${t}/steps/${n}`, {
      query: r,
      ...a,
      headers: { "OpenAI-Beta": "assistants=v2", ...a == null ? void 0 : a.headers }
    });
  }
  list(e, t, n = {}, r) {
    return W(n) ? this.list(e, t, {}, n) : this._client.getAPIList(`/threads/${e}/runs/${t}/steps`, Xn, {
      query: n,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r == null ? void 0 : r.headers }
    });
  }
}
class Xn extends z {
}
Hn.RunStepsPage = Xn;
let pt = class extends C {
  constructor() {
    super(...arguments), this.steps = new Hn(this._client);
  }
  create(e, t, n) {
    const { include: r, ...a } = t;
    return this._client.post(`/threads/${e}/runs`, {
      query: { include: r },
      body: a,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers },
      stream: t.stream ?? !1
    });
  }
  /**
   * Retrieves a run.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  retrieve(e, t, n) {
    return this._client.get(`/threads/${e}/runs/${t}`, {
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Modifies a run.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  update(e, t, n, r) {
    return this._client.post(`/threads/${e}/runs/${t}`, {
      body: n,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r == null ? void 0 : r.headers }
    });
  }
  list(e, t = {}, n) {
    return W(t) ? this.list(e, {}, t) : this._client.getAPIList(`/threads/${e}/runs`, Gn, {
      query: t,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Cancels a run that is `in_progress`.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  cancel(e, t, n) {
    return this._client.post(`/threads/${e}/runs/${t}/cancel`, {
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * A helper to create a run an poll for a terminal state. More information on Run
   * lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  async createAndPoll(e, t, n) {
    const r = await this.create(e, t, n);
    return await this.poll(e, r.id, n);
  }
  /**
   * Create a Run stream
   *
   * @deprecated use `stream` instead
   */
  createAndStream(e, t, n) {
    return oe.createAssistantStream(e, this._client.beta.threads.runs, t, n);
  }
  /**
   * A helper to poll a run status until it reaches a terminal state. More
   * information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  async poll(e, t, n) {
    const r = { ...n == null ? void 0 : n.headers, "X-Stainless-Poll-Helper": "true" };
    for (n != null && n.pollIntervalMs && (r["X-Stainless-Custom-Poll-Interval"] = n.pollIntervalMs.toString()); ; ) {
      const { data: a, response: i } = await this.retrieve(e, t, {
        ...n,
        headers: { ...n == null ? void 0 : n.headers, ...r }
      }).withResponse();
      switch (a.status) {
        //If we are in any sort of intermediate state we poll
        case "queued":
        case "in_progress":
        case "cancelling":
          let o = 5e3;
          if (n != null && n.pollIntervalMs)
            o = n.pollIntervalMs;
          else {
            const c = i.headers.get("openai-poll-after-ms");
            if (c) {
              const l = parseInt(c);
              isNaN(l) || (o = l);
            }
          }
          await ht(o);
          break;
        //We return the run in any terminal state.
        case "requires_action":
        case "incomplete":
        case "cancelled":
        case "completed":
        case "failed":
        case "expired":
          return a;
      }
    }
  }
  /**
   * Create a Run stream
   */
  stream(e, t, n) {
    return oe.createAssistantStream(e, this._client.beta.threads.runs, t, n);
  }
  submitToolOutputs(e, t, n, r) {
    return this._client.post(`/threads/${e}/runs/${t}/submit_tool_outputs`, {
      body: n,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r == null ? void 0 : r.headers },
      stream: n.stream ?? !1
    });
  }
  /**
   * A helper to submit a tool output to a run and poll for a terminal run state.
   * More information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  async submitToolOutputsAndPoll(e, t, n, r) {
    const a = await this.submitToolOutputs(e, t, n, r);
    return await this.poll(e, a.id, r);
  }
  /**
   * Submit the tool outputs from a previous run and stream the run to a terminal
   * state. More information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  submitToolOutputsStream(e, t, n, r) {
    return oe.createToolAssistantStream(e, t, this._client.beta.threads.runs, n, r);
  }
};
class Gn extends z {
}
pt.RunsPage = Gn;
pt.Steps = Hn;
pt.RunStepsPage = Xn;
class Xe extends C {
  constructor() {
    super(...arguments), this.runs = new pt(this._client), this.messages = new zn(this._client);
  }
  create(e = {}, t) {
    return W(e) ? this.create({}, e) : this._client.post("/threads", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Retrieves a thread.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  retrieve(e, t) {
    return this._client.get(`/threads/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Modifies a thread.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  update(e, t, n) {
    return this._client.post(`/threads/${e}`, {
      body: t,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Delete a thread.
   *
   * @deprecated The Assistants API is deprecated in favor of the Responses API
   */
  del(e, t) {
    return this._client.delete(`/threads/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
  createAndRun(e, t) {
    return this._client.post("/threads/runs", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers },
      stream: e.stream ?? !1
    });
  }
  /**
   * A helper to create a thread, start a run and then poll for a terminal state.
   * More information on Run lifecycles can be found here:
   * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
   */
  async createAndRunPoll(e, t) {
    const n = await this.createAndRun(e, t);
    return await this.runs.poll(n.thread_id, n.id, t);
  }
  /**
   * Create a thread and stream the run back
   */
  createAndRunStream(e, t) {
    return oe.createThreadAssistantStream(e, this._client.beta.threads, t);
  }
}
Xe.Runs = pt;
Xe.RunsPage = Gn;
Xe.Messages = zn;
Xe.MessagesPage = qn;
class Ge extends C {
  constructor() {
    super(...arguments), this.realtime = new Qt(this._client), this.chat = new Fn(this._client), this.assistants = new Wn(this._client), this.threads = new Xe(this._client);
  }
}
Ge.Realtime = Qt;
Ge.Assistants = Wn;
Ge.AssistantsPage = Vn;
Ge.Threads = Xe;
class wa extends C {
  create(e, t) {
    return this._client.post("/completions", { body: e, ...t, stream: e.stream ?? !1 });
  }
}
class ba extends C {
  /**
   * Retrieve Container File Content
   */
  retrieve(e, t, n) {
    return this._client.get(`/containers/${e}/files/${t}/content`, {
      ...n,
      headers: { Accept: "application/binary", ...n == null ? void 0 : n.headers },
      __binaryResponse: !0
    });
  }
}
let Yt = class extends C {
  constructor() {
    super(...arguments), this.content = new ba(this._client);
  }
  /**
   * Create a Container File
   *
   * You can send either a multipart/form-data request with the raw file content, or
   * a JSON request with a file ID.
   */
  create(e, t, n) {
    return this._client.post(`/containers/${e}/files`, Te({ body: t, ...n }));
  }
  /**
   * Retrieve Container File
   */
  retrieve(e, t, n) {
    return this._client.get(`/containers/${e}/files/${t}`, n);
  }
  list(e, t = {}, n) {
    return W(t) ? this.list(e, {}, t) : this._client.getAPIList(`/containers/${e}/files`, Qn, {
      query: t,
      ...n
    });
  }
  /**
   * Delete Container File
   */
  del(e, t, n) {
    return this._client.delete(`/containers/${e}/files/${t}`, {
      ...n,
      headers: { Accept: "*/*", ...n == null ? void 0 : n.headers }
    });
  }
};
class Qn extends z {
}
Yt.FileListResponsesPage = Qn;
Yt.Content = ba;
class gt extends C {
  constructor() {
    super(...arguments), this.files = new Yt(this._client);
  }
  /**
   * Create Container
   */
  create(e, t) {
    return this._client.post("/containers", { body: e, ...t });
  }
  /**
   * Retrieve Container
   */
  retrieve(e, t) {
    return this._client.get(`/containers/${e}`, t);
  }
  list(e = {}, t) {
    return W(e) ? this.list({}, e) : this._client.getAPIList("/containers", Yn, { query: e, ...t });
  }
  /**
   * Delete Container
   */
  del(e, t) {
    return this._client.delete(`/containers/${e}`, {
      ...t,
      headers: { Accept: "*/*", ...t == null ? void 0 : t.headers }
    });
  }
}
class Yn extends z {
}
gt.ContainerListResponsesPage = Yn;
gt.Files = Yt;
gt.FileListResponsesPage = Qn;
class xa extends C {
  /**
   * Creates an embedding vector representing the input text.
   *
   * @example
   * ```ts
   * const createEmbeddingResponse =
   *   await client.embeddings.create({
   *     input: 'The quick brown fox jumped over the lazy dog',
   *     model: 'text-embedding-3-small',
   *   });
   * ```
   */
  create(e, t) {
    const n = !!e.encoding_format;
    let r = n ? e.encoding_format : "base64";
    n && ve("Request", "User defined encoding_format:", e.encoding_format);
    const a = this._client.post("/embeddings", {
      body: {
        ...e,
        encoding_format: r
      },
      ...t
    });
    return n ? a : (ve("response", "Decoding base64 embeddings to float32 array"), a._thenUnwrap((i) => (i && i.data && i.data.forEach((o) => {
      const c = o.embedding;
      o.embedding = Ki(c);
    }), i)));
  }
}
class Kn extends C {
  /**
   * Get an evaluation run output item by ID.
   */
  retrieve(e, t, n, r) {
    return this._client.get(`/evals/${e}/runs/${t}/output_items/${n}`, r);
  }
  list(e, t, n = {}, r) {
    return W(n) ? this.list(e, t, {}, n) : this._client.getAPIList(`/evals/${e}/runs/${t}/output_items`, es, { query: n, ...r });
  }
}
class es extends z {
}
Kn.OutputItemListResponsesPage = es;
class _t extends C {
  constructor() {
    super(...arguments), this.outputItems = new Kn(this._client);
  }
  /**
   * Kicks off a new run for a given evaluation, specifying the data source, and what
   * model configuration to use to test. The datasource will be validated against the
   * schema specified in the config of the evaluation.
   */
  create(e, t, n) {
    return this._client.post(`/evals/${e}/runs`, { body: t, ...n });
  }
  /**
   * Get an evaluation run by ID.
   */
  retrieve(e, t, n) {
    return this._client.get(`/evals/${e}/runs/${t}`, n);
  }
  list(e, t = {}, n) {
    return W(t) ? this.list(e, {}, t) : this._client.getAPIList(`/evals/${e}/runs`, ts, { query: t, ...n });
  }
  /**
   * Delete an eval run.
   */
  del(e, t, n) {
    return this._client.delete(`/evals/${e}/runs/${t}`, n);
  }
  /**
   * Cancel an ongoing evaluation run.
   */
  cancel(e, t, n) {
    return this._client.post(`/evals/${e}/runs/${t}`, n);
  }
}
class ts extends z {
}
_t.RunListResponsesPage = ts;
_t.OutputItems = Kn;
_t.OutputItemListResponsesPage = es;
class yt extends C {
  constructor() {
    super(...arguments), this.runs = new _t(this._client);
  }
  /**
   * Create the structure of an evaluation that can be used to test a model's
   * performance. An evaluation is a set of testing criteria and the config for a
   * data source, which dictates the schema of the data used in the evaluation. After
   * creating an evaluation, you can run it on different models and model parameters.
   * We support several types of graders and datasources. For more information, see
   * the [Evals guide](https://platform.openai.com/docs/guides/evals).
   */
  create(e, t) {
    return this._client.post("/evals", { body: e, ...t });
  }
  /**
   * Get an evaluation by ID.
   */
  retrieve(e, t) {
    return this._client.get(`/evals/${e}`, t);
  }
  /**
   * Update certain properties of an evaluation.
   */
  update(e, t, n) {
    return this._client.post(`/evals/${e}`, { body: t, ...n });
  }
  list(e = {}, t) {
    return W(e) ? this.list({}, e) : this._client.getAPIList("/evals", ns, { query: e, ...t });
  }
  /**
   * Delete an evaluation.
   */
  del(e, t) {
    return this._client.delete(`/evals/${e}`, t);
  }
}
class ns extends z {
}
yt.EvalListResponsesPage = ns;
yt.Runs = _t;
yt.RunListResponsesPage = ts;
let ss = class extends C {
  /**
   * Upload a file that can be used across various endpoints. Individual files can be
   * up to 512 MB, and the size of all files uploaded by one organization can be up
   * to 100 GB.
   *
   * The Assistants API supports files up to 2 million tokens and of specific file
   * types. See the
   * [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools) for
   * details.
   *
   * The Fine-tuning API only supports `.jsonl` files. The input also has certain
   * required formats for fine-tuning
   * [chat](https://platform.openai.com/docs/api-reference/fine-tuning/chat-input) or
   * [completions](https://platform.openai.com/docs/api-reference/fine-tuning/completions-input)
   * models.
   *
   * The Batch API only supports `.jsonl` files up to 200 MB in size. The input also
   * has a specific required
   * [format](https://platform.openai.com/docs/api-reference/batch/request-input).
   *
   * Please [contact us](https://help.openai.com/) if you need to increase these
   * storage limits.
   */
  create(e, t) {
    return this._client.post("/files", Te({ body: e, ...t }));
  }
  /**
   * Returns information about a specific file.
   */
  retrieve(e, t) {
    return this._client.get(`/files/${e}`, t);
  }
  list(e = {}, t) {
    return W(e) ? this.list({}, e) : this._client.getAPIList("/files", rs, { query: e, ...t });
  }
  /**
   * Delete a file.
   */
  del(e, t) {
    return this._client.delete(`/files/${e}`, t);
  }
  /**
   * Returns the contents of the specified file.
   */
  content(e, t) {
    return this._client.get(`/files/${e}/content`, {
      ...t,
      headers: { Accept: "application/binary", ...t == null ? void 0 : t.headers },
      __binaryResponse: !0
    });
  }
  /**
   * Returns the contents of the specified file.
   *
   * @deprecated The `.content()` method should be used instead
   */
  retrieveContent(e, t) {
    return this._client.get(`/files/${e}/content`, t);
  }
  /**
   * Waits for the given file to be processed, default timeout is 30 mins.
   */
  async waitForProcessing(e, { pollInterval: t = 5e3, maxWait: n = 30 * 60 * 1e3 } = {}) {
    const r = /* @__PURE__ */ new Set(["processed", "error", "deleted"]), a = Date.now();
    let i = await this.retrieve(e);
    for (; !i.status || !r.has(i.status); )
      if (await ht(t), i = await this.retrieve(e), Date.now() - a > n)
        throw new Ln({
          message: `Giving up on waiting for file ${e} to finish processing after ${n} milliseconds.`
        });
    return i;
  }
};
class rs extends z {
}
ss.FileObjectsPage = rs;
class va extends C {
}
let Sa = class extends C {
  /**
   * Run a grader.
   *
   * @example
   * ```ts
   * const response = await client.fineTuning.alpha.graders.run({
   *   grader: {
   *     input: 'input',
   *     name: 'name',
   *     operation: 'eq',
   *     reference: 'reference',
   *     type: 'string_check',
   *   },
   *   model_sample: 'model_sample',
   *   reference_answer: 'string',
   * });
   * ```
   */
  run(e, t) {
    return this._client.post("/fine_tuning/alpha/graders/run", { body: e, ...t });
  }
  /**
   * Validate a grader.
   *
   * @example
   * ```ts
   * const response =
   *   await client.fineTuning.alpha.graders.validate({
   *     grader: {
   *       input: 'input',
   *       name: 'name',
   *       operation: 'eq',
   *       reference: 'reference',
   *       type: 'string_check',
   *     },
   *   });
   * ```
   */
  validate(e, t) {
    return this._client.post("/fine_tuning/alpha/graders/validate", { body: e, ...t });
  }
};
class as extends C {
  constructor() {
    super(...arguments), this.graders = new Sa(this._client);
  }
}
as.Graders = Sa;
class is extends C {
  /**
   * **NOTE:** Calling this endpoint requires an [admin API key](../admin-api-keys).
   *
   * This enables organization owners to share fine-tuned models with other projects
   * in their organization.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const permissionCreateResponse of client.fineTuning.checkpoints.permissions.create(
   *   'ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd',
   *   { project_ids: ['string'] },
   * )) {
   *   // ...
   * }
   * ```
   */
  create(e, t, n) {
    return this._client.getAPIList(`/fine_tuning/checkpoints/${e}/permissions`, os, { body: t, method: "post", ...n });
  }
  retrieve(e, t = {}, n) {
    return W(t) ? this.retrieve(e, {}, t) : this._client.get(`/fine_tuning/checkpoints/${e}/permissions`, {
      query: t,
      ...n
    });
  }
  /**
   * **NOTE:** This endpoint requires an [admin API key](../admin-api-keys).
   *
   * Organization owners can use this endpoint to delete a permission for a
   * fine-tuned model checkpoint.
   *
   * @example
   * ```ts
   * const permission =
   *   await client.fineTuning.checkpoints.permissions.del(
   *     'ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd',
   *     'cp_zc4Q7MP6XxulcVzj4MZdwsAB',
   *   );
   * ```
   */
  del(e, t, n) {
    return this._client.delete(`/fine_tuning/checkpoints/${e}/permissions/${t}`, n);
  }
}
class os extends qt {
}
is.PermissionCreateResponsesPage = os;
let Kt = class extends C {
  constructor() {
    super(...arguments), this.permissions = new is(this._client);
  }
};
Kt.Permissions = is;
Kt.PermissionCreateResponsesPage = os;
class cs extends C {
  list(e, t = {}, n) {
    return W(t) ? this.list(e, {}, t) : this._client.getAPIList(`/fine_tuning/jobs/${e}/checkpoints`, ls, { query: t, ...n });
  }
}
class ls extends z {
}
cs.FineTuningJobCheckpointsPage = ls;
class Qe extends C {
  constructor() {
    super(...arguments), this.checkpoints = new cs(this._client);
  }
  /**
   * Creates a fine-tuning job which begins the process of creating a new model from
   * a given dataset.
   *
   * Response includes details of the enqueued job including job status and the name
   * of the fine-tuned models once complete.
   *
   * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
   *
   * @example
   * ```ts
   * const fineTuningJob = await client.fineTuning.jobs.create({
   *   model: 'gpt-4o-mini',
   *   training_file: 'file-abc123',
   * });
   * ```
   */
  create(e, t) {
    return this._client.post("/fine_tuning/jobs", { body: e, ...t });
  }
  /**
   * Get info about a fine-tuning job.
   *
   * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
   *
   * @example
   * ```ts
   * const fineTuningJob = await client.fineTuning.jobs.retrieve(
   *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
   * );
   * ```
   */
  retrieve(e, t) {
    return this._client.get(`/fine_tuning/jobs/${e}`, t);
  }
  list(e = {}, t) {
    return W(e) ? this.list({}, e) : this._client.getAPIList("/fine_tuning/jobs", us, { query: e, ...t });
  }
  /**
   * Immediately cancel a fine-tune job.
   *
   * @example
   * ```ts
   * const fineTuningJob = await client.fineTuning.jobs.cancel(
   *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
   * );
   * ```
   */
  cancel(e, t) {
    return this._client.post(`/fine_tuning/jobs/${e}/cancel`, t);
  }
  listEvents(e, t = {}, n) {
    return W(t) ? this.listEvents(e, {}, t) : this._client.getAPIList(`/fine_tuning/jobs/${e}/events`, ds, {
      query: t,
      ...n
    });
  }
  /**
   * Pause a fine-tune job.
   *
   * @example
   * ```ts
   * const fineTuningJob = await client.fineTuning.jobs.pause(
   *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
   * );
   * ```
   */
  pause(e, t) {
    return this._client.post(`/fine_tuning/jobs/${e}/pause`, t);
  }
  /**
   * Resume a fine-tune job.
   *
   * @example
   * ```ts
   * const fineTuningJob = await client.fineTuning.jobs.resume(
   *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
   * );
   * ```
   */
  resume(e, t) {
    return this._client.post(`/fine_tuning/jobs/${e}/resume`, t);
  }
}
class us extends z {
}
class ds extends z {
}
Qe.FineTuningJobsPage = us;
Qe.FineTuningJobEventsPage = ds;
Qe.Checkpoints = cs;
Qe.FineTuningJobCheckpointsPage = ls;
class ke extends C {
  constructor() {
    super(...arguments), this.methods = new va(this._client), this.jobs = new Qe(this._client), this.checkpoints = new Kt(this._client), this.alpha = new as(this._client);
  }
}
ke.Methods = va;
ke.Jobs = Qe;
ke.FineTuningJobsPage = us;
ke.FineTuningJobEventsPage = ds;
ke.Checkpoints = Kt;
ke.Alpha = as;
class Aa extends C {
}
class hs extends C {
  constructor() {
    super(...arguments), this.graderModels = new Aa(this._client);
  }
}
hs.GraderModels = Aa;
class ka extends C {
  /**
   * Creates a variation of a given image. This endpoint only supports `dall-e-2`.
   *
   * @example
   * ```ts
   * const imagesResponse = await client.images.createVariation({
   *   image: fs.createReadStream('otter.png'),
   * });
   * ```
   */
  createVariation(e, t) {
    return this._client.post("/images/variations", Te({ body: e, ...t }));
  }
  /**
   * Creates an edited or extended image given one or more source images and a
   * prompt. This endpoint only supports `gpt-image-1` and `dall-e-2`.
   *
   * @example
   * ```ts
   * const imagesResponse = await client.images.edit({
   *   image: fs.createReadStream('path/to/file'),
   *   prompt: 'A cute baby sea otter wearing a beret',
   * });
   * ```
   */
  edit(e, t) {
    return this._client.post("/images/edits", Te({ body: e, ...t }));
  }
  /**
   * Creates an image given a prompt.
   * [Learn more](https://platform.openai.com/docs/guides/images).
   *
   * @example
   * ```ts
   * const imagesResponse = await client.images.generate({
   *   prompt: 'A cute baby sea otter',
   * });
   * ```
   */
  generate(e, t) {
    return this._client.post("/images/generations", { body: e, ...t });
  }
}
class fs extends C {
  /**
   * Retrieves a model instance, providing basic information about the model such as
   * the owner and permissioning.
   */
  retrieve(e, t) {
    return this._client.get(`/models/${e}`, t);
  }
  /**
   * Lists the currently available models, and provides basic information about each
   * one such as the owner and availability.
   */
  list(e) {
    return this._client.getAPIList("/models", ms, e);
  }
  /**
   * Delete a fine-tuned model. You must have the Owner role in your organization to
   * delete a model.
   */
  del(e, t) {
    return this._client.delete(`/models/${e}`, t);
  }
}
class ms extends qt {
}
fs.ModelsPage = ms;
class Ca extends C {
  /**
   * Classifies if text and/or image inputs are potentially harmful. Learn more in
   * the [moderation guide](https://platform.openai.com/docs/guides/moderation).
   */
  create(e, t) {
    return this._client.post("/moderations", { body: e, ...t });
  }
}
function fo(s, e) {
  return !e || !po(e) ? {
    ...s,
    output_parsed: null,
    output: s.output.map((t) => t.type === "function_call" ? {
      ...t,
      parsed_arguments: null
    } : t.type === "message" ? {
      ...t,
      content: t.content.map((n) => ({
        ...n,
        parsed: null
      }))
    } : t)
  } : Pa(s, e);
}
function Pa(s, e) {
  const t = s.output.map((r) => {
    if (r.type === "function_call")
      return {
        ...r,
        parsed_arguments: yo(e, r)
      };
    if (r.type === "message") {
      const a = r.content.map((i) => i.type === "output_text" ? {
        ...i,
        parsed: mo(e, i.text)
      } : i);
      return {
        ...r,
        content: a
      };
    }
    return r;
  }), n = Object.assign({}, s, { output: t });
  return Object.getOwnPropertyDescriptor(s, "output_text") || Ra(n), Object.defineProperty(n, "output_parsed", {
    enumerable: !0,
    get() {
      for (const r of n.output)
        if (r.type === "message") {
          for (const a of r.content)
            if (a.type === "output_text" && a.parsed !== null)
              return a.parsed;
        }
      return null;
    }
  }), n;
}
function mo(s, e) {
  var t, n, r, a;
  return ((n = (t = s.text) == null ? void 0 : t.format) == null ? void 0 : n.type) !== "json_schema" ? null : "$parseRaw" in ((r = s.text) == null ? void 0 : r.format) ? ((a = s.text) == null ? void 0 : a.format).$parseRaw(e) : JSON.parse(e);
}
function po(s) {
  var e;
  return !!Zn((e = s.text) == null ? void 0 : e.format);
}
function go(s) {
  return (s == null ? void 0 : s.$brand) === "auto-parseable-tool";
}
function _o(s, e) {
  return s.find((t) => t.type === "function" && t.name === e);
}
function yo(s, e) {
  const t = _o(s.tools ?? [], e.name);
  return {
    ...e,
    ...e,
    parsed_arguments: go(t) ? t.$parseRaw(e.arguments) : t != null && t.strict ? JSON.parse(e.arguments) : null
  };
}
function Ra(s) {
  const e = [];
  for (const t of s.output)
    if (t.type === "message")
      for (const n of t.content)
        n.type === "output_text" && e.push(n.text);
  s.output_text = e.join("");
}
class Ia extends C {
  list(e, t = {}, n) {
    return W(t) ? this.list(e, {}, t) : this._client.getAPIList(`/responses/${e}/input_items`, bo, {
      query: t,
      ...n
    });
  }
}
var Me = function(s, e, t, n, r) {
  if (n === "m") throw new TypeError("Private method is not writable");
  if (n === "a" && !r) throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? s !== e || !r : !e.has(s)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return n === "a" ? r.call(s, t) : r ? r.value = t : e.set(s, t), t;
}, _e = function(s, e, t, n) {
  if (t === "a" && !n) throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? s !== e || !n : !e.has(s)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? n : t === "a" ? n.call(s) : n ? n.value : e.get(s);
}, De, Ct, ye, Pt, rr, ar, ir, or;
class ps extends Un {
  constructor(e) {
    super(), De.add(this), Ct.set(this, void 0), ye.set(this, void 0), Pt.set(this, void 0), Me(this, Ct, e, "f");
  }
  static createResponse(e, t, n) {
    const r = new ps(t);
    return r._run(() => r._createOrRetrieveResponse(e, t, {
      ...n,
      headers: { ...n == null ? void 0 : n.headers, "X-Stainless-Helper-Method": "stream" }
    })), r;
  }
  async _createOrRetrieveResponse(e, t, n) {
    var o;
    const r = n == null ? void 0 : n.signal;
    r && (r.aborted && this.controller.abort(), r.addEventListener("abort", () => this.controller.abort())), _e(this, De, "m", rr).call(this);
    let a, i = null;
    "response_id" in t ? (a = await e.responses.retrieve(t.response_id, { stream: !0 }, { ...n, signal: this.controller.signal, stream: !0 }), i = t.starting_after ?? null) : a = await e.responses.create({ ...t, stream: !0 }, { ...n, signal: this.controller.signal }), this._connected();
    for await (const c of a)
      _e(this, De, "m", ar).call(this, c, i);
    if ((o = a.controller.signal) != null && o.aborted)
      throw new se();
    return _e(this, De, "m", ir).call(this);
  }
  [(Ct = /* @__PURE__ */ new WeakMap(), ye = /* @__PURE__ */ new WeakMap(), Pt = /* @__PURE__ */ new WeakMap(), De = /* @__PURE__ */ new WeakSet(), rr = function() {
    this.ended || Me(this, ye, void 0, "f");
  }, ar = function(t, n) {
    if (this.ended)
      return;
    const r = (i, o) => {
      (n == null || o.sequence_number > n) && this._emit(i, o);
    }, a = _e(this, De, "m", or).call(this, t);
    switch (r("event", t), t.type) {
      case "response.output_text.delta": {
        const i = a.output[t.output_index];
        if (!i)
          throw new A(`missing output at index ${t.output_index}`);
        if (i.type === "message") {
          const o = i.content[t.content_index];
          if (!o)
            throw new A(`missing content at index ${t.content_index}`);
          if (o.type !== "output_text")
            throw new A(`expected content to be 'output_text', got ${o.type}`);
          r("response.output_text.delta", {
            ...t,
            snapshot: o.text
          });
        }
        break;
      }
      case "response.function_call_arguments.delta": {
        const i = a.output[t.output_index];
        if (!i)
          throw new A(`missing output at index ${t.output_index}`);
        i.type === "function_call" && r("response.function_call_arguments.delta", {
          ...t,
          snapshot: i.arguments
        });
        break;
      }
      default:
        r(t.type, t);
        break;
    }
  }, ir = function() {
    if (this.ended)
      throw new A("stream has ended, this shouldn't happen");
    const t = _e(this, ye, "f");
    if (!t)
      throw new A("request ended without sending any events");
    Me(this, ye, void 0, "f");
    const n = wo(t, _e(this, Ct, "f"));
    return Me(this, Pt, n, "f"), n;
  }, or = function(t) {
    let n = _e(this, ye, "f");
    if (!n) {
      if (t.type !== "response.created")
        throw new A(`When snapshot hasn't been set yet, expected 'response.created' event, got ${t.type}`);
      return n = Me(this, ye, t.response, "f"), n;
    }
    switch (t.type) {
      case "response.output_item.added": {
        n.output.push(t.item);
        break;
      }
      case "response.content_part.added": {
        const r = n.output[t.output_index];
        if (!r)
          throw new A(`missing output at index ${t.output_index}`);
        r.type === "message" && r.content.push(t.part);
        break;
      }
      case "response.output_text.delta": {
        const r = n.output[t.output_index];
        if (!r)
          throw new A(`missing output at index ${t.output_index}`);
        if (r.type === "message") {
          const a = r.content[t.content_index];
          if (!a)
            throw new A(`missing content at index ${t.content_index}`);
          if (a.type !== "output_text")
            throw new A(`expected content to be 'output_text', got ${a.type}`);
          a.text += t.delta;
        }
        break;
      }
      case "response.function_call_arguments.delta": {
        const r = n.output[t.output_index];
        if (!r)
          throw new A(`missing output at index ${t.output_index}`);
        r.type === "function_call" && (r.arguments += t.delta);
        break;
      }
      case "response.completed": {
        Me(this, ye, t.response, "f");
        break;
      }
    }
    return n;
  }, Symbol.asyncIterator)]() {
    const e = [], t = [];
    let n = !1;
    return this.on("event", (r) => {
      const a = t.shift();
      a ? a.resolve(r) : e.push(r);
    }), this.on("end", () => {
      n = !0;
      for (const r of t)
        r.resolve(void 0);
      t.length = 0;
    }), this.on("abort", (r) => {
      n = !0;
      for (const a of t)
        a.reject(r);
      t.length = 0;
    }), this.on("error", (r) => {
      n = !0;
      for (const a of t)
        a.reject(r);
      t.length = 0;
    }), {
      next: async () => e.length ? { value: e.shift(), done: !1 } : n ? { value: void 0, done: !0 } : new Promise((a, i) => t.push({ resolve: a, reject: i })).then((a) => a ? { value: a, done: !1 } : { value: void 0, done: !0 }),
      return: async () => (this.abort(), { value: void 0, done: !0 })
    };
  }
  /**
   * @returns a promise that resolves with the final Response, or rejects
   * if an error occurred or the stream ended prematurely without producing a REsponse.
   */
  async finalResponse() {
    await this.done();
    const e = _e(this, Pt, "f");
    if (!e)
      throw new A("stream ended without producing a ChatCompletion");
    return e;
  }
}
function wo(s, e) {
  return fo(s, e);
}
class gs extends C {
  constructor() {
    super(...arguments), this.inputItems = new Ia(this._client);
  }
  create(e, t) {
    return this._client.post("/responses", { body: e, ...t, stream: e.stream ?? !1 })._thenUnwrap((n) => ("object" in n && n.object === "response" && Ra(n), n));
  }
  retrieve(e, t = {}, n) {
    return this._client.get(`/responses/${e}`, {
      query: t,
      ...n,
      stream: (t == null ? void 0 : t.stream) ?? !1
    });
  }
  /**
   * Deletes a model response with the given ID.
   *
   * @example
   * ```ts
   * await client.responses.del(
   *   'resp_677efb5139a88190b512bc3fef8e535d',
   * );
   * ```
   */
  del(e, t) {
    return this._client.delete(`/responses/${e}`, {
      ...t,
      headers: { Accept: "*/*", ...t == null ? void 0 : t.headers }
    });
  }
  parse(e, t) {
    return this._client.responses.create(e, t)._thenUnwrap((n) => Pa(n, e));
  }
  /**
   * Creates a model response stream
   */
  stream(e, t) {
    return ps.createResponse(this._client, e, t);
  }
  /**
   * Cancels a model response with the given ID. Only responses created with the
   * `background` parameter set to `true` can be cancelled.
   * [Learn more](https://platform.openai.com/docs/guides/background).
   *
   * @example
   * ```ts
   * await client.responses.cancel(
   *   'resp_677efb5139a88190b512bc3fef8e535d',
   * );
   * ```
   */
  cancel(e, t) {
    return this._client.post(`/responses/${e}/cancel`, {
      ...t,
      headers: { Accept: "*/*", ...t == null ? void 0 : t.headers }
    });
  }
}
class bo extends z {
}
gs.InputItems = Ia;
class Ea extends C {
  /**
   * Adds a
   * [Part](https://platform.openai.com/docs/api-reference/uploads/part-object) to an
   * [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object.
   * A Part represents a chunk of bytes from the file you are trying to upload.
   *
   * Each Part can be at most 64 MB, and you can add Parts until you hit the Upload
   * maximum of 8 GB.
   *
   * It is possible to add multiple Parts in parallel. You can decide the intended
   * order of the Parts when you
   * [complete the Upload](https://platform.openai.com/docs/api-reference/uploads/complete).
   */
  create(e, t, n) {
    return this._client.post(`/uploads/${e}/parts`, Te({ body: t, ...n }));
  }
}
class _s extends C {
  constructor() {
    super(...arguments), this.parts = new Ea(this._client);
  }
  /**
   * Creates an intermediate
   * [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object
   * that you can add
   * [Parts](https://platform.openai.com/docs/api-reference/uploads/part-object) to.
   * Currently, an Upload can accept at most 8 GB in total and expires after an hour
   * after you create it.
   *
   * Once you complete the Upload, we will create a
   * [File](https://platform.openai.com/docs/api-reference/files/object) object that
   * contains all the parts you uploaded. This File is usable in the rest of our
   * platform as a regular File object.
   *
   * For certain `purpose` values, the correct `mime_type` must be specified. Please
   * refer to documentation for the
   * [supported MIME types for your use case](https://platform.openai.com/docs/assistants/tools/file-search#supported-files).
   *
   * For guidance on the proper filename extensions for each purpose, please follow
   * the documentation on
   * [creating a File](https://platform.openai.com/docs/api-reference/files/create).
   */
  create(e, t) {
    return this._client.post("/uploads", { body: e, ...t });
  }
  /**
   * Cancels the Upload. No Parts may be added after an Upload is cancelled.
   */
  cancel(e, t) {
    return this._client.post(`/uploads/${e}/cancel`, t);
  }
  /**
   * Completes the
   * [Upload](https://platform.openai.com/docs/api-reference/uploads/object).
   *
   * Within the returned Upload object, there is a nested
   * [File](https://platform.openai.com/docs/api-reference/files/object) object that
   * is ready to use in the rest of the platform.
   *
   * You can specify the order of the Parts by passing in an ordered list of the Part
   * IDs.
   *
   * The number of bytes uploaded upon completion must match the number of bytes
   * initially specified when creating the Upload object. No Parts may be added after
   * an Upload is completed.
   */
  complete(e, t, n) {
    return this._client.post(`/uploads/${e}/complete`, { body: t, ...n });
  }
}
_s.Parts = Ea;
const xo = async (s) => {
  const e = await Promise.allSettled(s), t = e.filter((r) => r.status === "rejected");
  if (t.length) {
    for (const r of t)
      console.error(r.reason);
    throw new Error(`${t.length} promise(s) failed - see the above errors`);
  }
  const n = [];
  for (const r of e)
    r.status === "fulfilled" && n.push(r.value);
  return n;
};
class en extends C {
  /**
   * Create a vector store file by attaching a
   * [File](https://platform.openai.com/docs/api-reference/files) to a
   * [vector store](https://platform.openai.com/docs/api-reference/vector-stores/object).
   */
  create(e, t, n) {
    return this._client.post(`/vector_stores/${e}/files`, {
      body: t,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Retrieves a vector store file.
   */
  retrieve(e, t, n) {
    return this._client.get(`/vector_stores/${e}/files/${t}`, {
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Update attributes on a vector store file.
   */
  update(e, t, n, r) {
    return this._client.post(`/vector_stores/${e}/files/${t}`, {
      body: n,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v2", ...r == null ? void 0 : r.headers }
    });
  }
  list(e, t = {}, n) {
    return W(t) ? this.list(e, {}, t) : this._client.getAPIList(`/vector_stores/${e}/files`, tn, {
      query: t,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Delete a vector store file. This will remove the file from the vector store but
   * the file itself will not be deleted. To delete the file, use the
   * [delete file](https://platform.openai.com/docs/api-reference/files/delete)
   * endpoint.
   */
  del(e, t, n) {
    return this._client.delete(`/vector_stores/${e}/files/${t}`, {
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Attach a file to the given vector store and wait for it to be processed.
   */
  async createAndPoll(e, t, n) {
    const r = await this.create(e, t, n);
    return await this.poll(e, r.id, n);
  }
  /**
   * Wait for the vector store file to finish processing.
   *
   * Note: this will return even if the file failed to process, you need to check
   * file.last_error and file.status to handle these cases
   */
  async poll(e, t, n) {
    const r = { ...n == null ? void 0 : n.headers, "X-Stainless-Poll-Helper": "true" };
    for (n != null && n.pollIntervalMs && (r["X-Stainless-Custom-Poll-Interval"] = n.pollIntervalMs.toString()); ; ) {
      const a = await this.retrieve(e, t, {
        ...n,
        headers: r
      }).withResponse(), i = a.data;
      switch (i.status) {
        case "in_progress":
          let o = 5e3;
          if (n != null && n.pollIntervalMs)
            o = n.pollIntervalMs;
          else {
            const c = a.response.headers.get("openai-poll-after-ms");
            if (c) {
              const l = parseInt(c);
              isNaN(l) || (o = l);
            }
          }
          await ht(o);
          break;
        case "failed":
        case "completed":
          return i;
      }
    }
  }
  /**
   * Upload a file to the `files` API and then attach it to the given vector store.
   *
   * Note the file will be asynchronously processed (you can use the alternative
   * polling helper method to wait for processing to complete).
   */
  async upload(e, t, n) {
    const r = await this._client.files.create({ file: t, purpose: "assistants" }, n);
    return this.create(e, { file_id: r.id }, n);
  }
  /**
   * Add a file to a vector store and poll until processing is complete.
   */
  async uploadAndPoll(e, t, n) {
    const r = await this.upload(e, t, n);
    return await this.poll(e, r.id, n);
  }
  /**
   * Retrieve the parsed contents of a vector store file.
   */
  content(e, t, n) {
    return this._client.getAPIList(`/vector_stores/${e}/files/${t}/content`, ys, { ...n, headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers } });
  }
}
class tn extends z {
}
class ys extends qt {
}
en.VectorStoreFilesPage = tn;
en.FileContentResponsesPage = ys;
class $a extends C {
  /**
   * Create a vector store file batch.
   */
  create(e, t, n) {
    return this._client.post(`/vector_stores/${e}/file_batches`, {
      body: t,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Retrieves a vector store file batch.
   */
  retrieve(e, t, n) {
    return this._client.get(`/vector_stores/${e}/file_batches/${t}`, {
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Cancel a vector store file batch. This attempts to cancel the processing of
   * files in this batch as soon as possible.
   */
  cancel(e, t, n) {
    return this._client.post(`/vector_stores/${e}/file_batches/${t}/cancel`, {
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  /**
   * Create a vector store batch and poll until all files have been processed.
   */
  async createAndPoll(e, t, n) {
    const r = await this.create(e, t);
    return await this.poll(e, r.id, n);
  }
  listFiles(e, t, n = {}, r) {
    return W(n) ? this.listFiles(e, t, {}, n) : this._client.getAPIList(`/vector_stores/${e}/file_batches/${t}/files`, tn, { query: n, ...r, headers: { "OpenAI-Beta": "assistants=v2", ...r == null ? void 0 : r.headers } });
  }
  /**
   * Wait for the given file batch to be processed.
   *
   * Note: this will return even if one of the files failed to process, you need to
   * check batch.file_counts.failed_count to handle this case.
   */
  async poll(e, t, n) {
    const r = { ...n == null ? void 0 : n.headers, "X-Stainless-Poll-Helper": "true" };
    for (n != null && n.pollIntervalMs && (r["X-Stainless-Custom-Poll-Interval"] = n.pollIntervalMs.toString()); ; ) {
      const { data: a, response: i } = await this.retrieve(e, t, {
        ...n,
        headers: r
      }).withResponse();
      switch (a.status) {
        case "in_progress":
          let o = 5e3;
          if (n != null && n.pollIntervalMs)
            o = n.pollIntervalMs;
          else {
            const c = i.headers.get("openai-poll-after-ms");
            if (c) {
              const l = parseInt(c);
              isNaN(l) || (o = l);
            }
          }
          await ht(o);
          break;
        case "failed":
        case "cancelled":
        case "completed":
          return a;
      }
    }
  }
  /**
   * Uploads the given files concurrently and then creates a vector store file batch.
   *
   * The concurrency limit is configurable using the `maxConcurrency` parameter.
   */
  async uploadAndPoll(e, { files: t, fileIds: n = [] }, r) {
    if (t == null || t.length == 0)
      throw new Error("No `files` provided to process. If you've already uploaded files you should use `.createAndPoll()` instead");
    const a = (r == null ? void 0 : r.maxConcurrency) ?? 5, i = Math.min(a, t.length), o = this._client, c = t.values(), l = [...n];
    async function d(f) {
      for (let g of f) {
        const x = await o.files.create({ file: g, purpose: "assistants" }, r);
        l.push(x.id);
      }
    }
    const u = Array(i).fill(c).map(d);
    return await xo(u), await this.createAndPoll(e, {
      file_ids: l
    });
  }
}
class Ce extends C {
  constructor() {
    super(...arguments), this.files = new en(this._client), this.fileBatches = new $a(this._client);
  }
  /**
   * Create a vector store.
   */
  create(e, t) {
    return this._client.post("/vector_stores", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Retrieves a vector store.
   */
  retrieve(e, t) {
    return this._client.get(`/vector_stores/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Modifies a vector store.
   */
  update(e, t, n) {
    return this._client.post(`/vector_stores/${e}`, {
      body: t,
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
  list(e = {}, t) {
    return W(e) ? this.list({}, e) : this._client.getAPIList("/vector_stores", ws, {
      query: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Delete a vector store.
   */
  del(e, t) {
    return this._client.delete(`/vector_stores/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v2", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Search a vector store for relevant chunks based on a query and file attributes
   * filter.
   */
  search(e, t, n) {
    return this._client.getAPIList(`/vector_stores/${e}/search`, bs, {
      body: t,
      method: "post",
      ...n,
      headers: { "OpenAI-Beta": "assistants=v2", ...n == null ? void 0 : n.headers }
    });
  }
}
class ws extends z {
}
class bs extends qt {
}
Ce.VectorStoresPage = ws;
Ce.VectorStoreSearchResponsesPage = bs;
Ce.Files = en;
Ce.VectorStoreFilesPage = tn;
Ce.FileContentResponsesPage = ys;
Ce.FileBatches = $a;
var Ta;
class I extends Ui {
  /**
   * API Client for interfacing with the OpenAI API.
   *
   * @param {string | undefined} [opts.apiKey=process.env['OPENAI_API_KEY'] ?? undefined]
   * @param {string | null | undefined} [opts.organization=process.env['OPENAI_ORG_ID'] ?? null]
   * @param {string | null | undefined} [opts.project=process.env['OPENAI_PROJECT_ID'] ?? null]
   * @param {string} [opts.baseURL=process.env['OPENAI_BASE_URL'] ?? https://api.openai.com/v1] - Override the default base URL for the API.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
   * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   */
  constructor({ baseURL: e = xt("OPENAI_BASE_URL"), apiKey: t = xt("OPENAI_API_KEY"), organization: n = xt("OPENAI_ORG_ID") ?? null, project: r = xt("OPENAI_PROJECT_ID") ?? null, ...a } = {}) {
    if (t === void 0)
      throw new A("The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).");
    const i = {
      apiKey: t,
      organization: n,
      project: r,
      ...a,
      baseURL: e || "https://api.openai.com/v1"
    };
    if (!i.dangerouslyAllowBrowser && Qi())
      throw new A(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
`);
    super({
      baseURL: i.baseURL,
      timeout: i.timeout ?? 6e5,
      httpAgent: i.httpAgent,
      maxRetries: i.maxRetries,
      fetch: i.fetch
    }), this.completions = new wa(this), this.chat = new Gt(this), this.embeddings = new xa(this), this.files = new ss(this), this.images = new ka(this), this.audio = new ft(this), this.moderations = new Ca(this), this.models = new fs(this), this.fineTuning = new ke(this), this.graders = new hs(this), this.vectorStores = new Ce(this), this.beta = new Ge(this), this.batches = new Bn(this), this.uploads = new _s(this), this.responses = new gs(this), this.evals = new yt(this), this.containers = new gt(this), this._options = i, this.apiKey = t, this.organization = n, this.project = r;
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  defaultHeaders(e) {
    return {
      ...super.defaultHeaders(e),
      "OpenAI-Organization": this.organization,
      "OpenAI-Project": this.project,
      ...this._options.defaultHeaders
    };
  }
  authHeaders(e) {
    return { Authorization: `Bearer ${this.apiKey}` };
  }
  stringifyQuery(e) {
    return Si(e, { arrayFormat: "brackets" });
  }
}
Ta = I;
I.OpenAI = Ta;
I.DEFAULT_TIMEOUT = 6e5;
I.OpenAIError = A;
I.APIError = G;
I.APIConnectionError = Vt;
I.APIConnectionTimeoutError = Ln;
I.APIUserAbortError = se;
I.NotFoundError = Er;
I.ConflictError = $r;
I.RateLimitError = Or;
I.BadRequestError = Pr;
I.AuthenticationError = Rr;
I.InternalServerError = Fr;
I.PermissionDeniedError = Ir;
I.UnprocessableEntityError = Tr;
I.toFile = jr;
I.fileFromPath = Ar;
I.Completions = wa;
I.Chat = Gt;
I.ChatCompletionsPage = Xt;
I.Embeddings = xa;
I.Files = ss;
I.FileObjectsPage = rs;
I.Images = ka;
I.Audio = ft;
I.Moderations = Ca;
I.Models = fs;
I.ModelsPage = ms;
I.FineTuning = ke;
I.Graders = hs;
I.VectorStores = Ce;
I.VectorStoresPage = ws;
I.VectorStoreSearchResponsesPage = bs;
I.Beta = Ge;
I.Batches = Bn;
I.BatchesPage = jn;
I.Uploads = _s;
I.Responses = gs;
I.Evals = yt;
I.EvalListResponsesPage = ns;
I.Containers = gt;
I.ContainerListResponsesPage = Yn;
const Nn = new I({
  apiKey: "<your-api-key>",
  dangerouslyAllowBrowser: !0
});
async function vo(s, e) {
  try {
    const t = s.map((r) => ({
      audioBufferBase64: So(r.audioBuffer),
      transcription: r.transcription,
      originalSentenceText: r.originalSentenceText
    })), n = `export const ${e} = ${JSON.stringify(t, null, 2)};`;
    console.log(`🔧 Capture mode: Saving ${e} fixture...`), console.log("Fixture content:", n), console.log(
      "📝 Copy this content to src/pdf-reader/fixtures/" + e + ".ts"
    ), localStorage.setItem(`fixture_${e}`, n);
  } catch (t) {
    console.error("Failed to save audio fixtures:", t);
  }
}
function So(s) {
  const e = new Uint8Array(s);
  let t = "";
  for (let n = 0; n < e.byteLength; n++)
    t += String.fromCharCode(e[n]);
  return btoa(t);
}
function Ao(s) {
  const e = atob(s), t = e.length, n = new Uint8Array(t);
  for (let r = 0; r < t; r++)
    n[r] = e.charCodeAt(r);
  return n.buffer;
}
async function ko(s) {
  try {
    let e;
    if (s === "audioForFirstSection")
      e = (await import("./audioForFirstSection-CjOcBZ5V.js")).audioForFirstSection;
    else if (s === "audioForRestOfSections")
      try {
        e = (await import("./audioForRestOfSections-CMgySP2s.js")).audioForRestOfSections;
      } catch {
        return console.warn(`Fixture ${s} not found, will use API`), null;
      }
    else
      return console.warn(`Unknown fixture key: ${s}`), null;
    return console.log(
      `🔧 Development mode: Using audio fixtures for ${s} instead of OpenAI APIs`
    ), e.map((n) => ({
      audioBuffer: n.audioBufferBase64 ? Ao(n.audioBufferBase64) : new ArrayBuffer(0),
      transcription: {
        ...n.transcription,
        task: n.transcription.task || "transcribe",
        usage: n.transcription.usage || {
          type: "duration",
          seconds: n.transcription.duration || 0
        }
      },
      originalSentenceText: n.originalSentenceText
    }));
  } catch (e) {
    return console.warn(
      `Failed to load audio fixtures for ${s}, falling back to OpenAI APIs:`,
      e
    ), null;
  }
}
async function Co(s) {
  try {
    let e;
    return s === "analyzePageStructureFixture" && (e = (await import("./analyzePageStructure-CmRNpMOs.js")).analyzePageStructureFixture), console.log(
      `🔧 Development mode: Using completion fixtures for ${s} instead of OpenAI APIs`
    ), e;
  } catch (e) {
    return console.warn(
      `Failed to load completion fixtures for ${s}, falling back to OpenAI APIs:`,
      e
    ), null;
  }
}
async function Po(s, e) {
  try {
    const t = `export const ${e} = ${JSON.stringify(s, null, 2)};`;
    console.log(`🔧 Capture mode: Saving ${e} fixture...`), console.log("Fixture content:", t), console.log(
      "📝 Copy this content to src/pdf-reader/fixtures/" + e + ".ts"
    ), localStorage.setItem(`fixture_${e}`, t);
  } catch (t) {
    console.error("Failed to save completion fixtures:", t);
  }
}
const Ro = !0, Io = !0, cr = rn({
  sections: Ls(
    rn({
      title: Ds(),
      readingRelevance: hi(),
      sentences: Ls(
        rn({
          sentenceText: Ds(),
          continuesOnNextPage: fi()
        })
      )
    })
  )
});
async function Eo(s) {
  try {
    const n = await Co(
      "analyzePageStructureFixture"
    );
    if (n)
      return n;
  } catch (n) {
    console.warn(
      "Failed to load completion fixtures, falling back to OpenAI:",
      n
    );
  }
  const e = await $o(s), t = `
  ## You are an expert PDF reader. 
  Analyze the PDF page image and extract structured information about its content and layout - as described in the schema.
  Think of this task as a preparation for a reading assistant.

  ## Schema 
  ${cr.describe("JSON schema for the page structure")}

  ## Instructions

  ### Sections
  1. Visually inspect the page to find text blocks and a title for the given section.
    - title should be always in a separate section.
    - if group of text is in a similar font, put it in a single section, otherwise create a new section for each group.
    - if a wider-than-average (line height) white space is between two blocks of text, treat it as a delimiter between two separate sections.
  2. Do not omit short sections, like article titles, authors, table of contents, etc.
  3. If a section continues on the next page, set the continuesOnNextPage flag to true, otherwise false.

  ### Reading Relevance
  1. Assign a reading relevance score (0-5) to every section, 0 being not relevant and 5 being very relevant. You must not omit any section in your response.
  2. Title should have a reading relevance score of 5.
  3. Examine fonts: 
  - sections with fonts with bold text should have a higher reading relevance score.
  - sections with small or light fonts should have a lower reading relevance score.
  - regular fonts should be have a reading relevance score of 5.

  ### Sentences
  1. Don't omit ANY sentence from a given section. You must include all sentences!
  2. If a sentence is broken into multiple lines, PRESERVE the exact characters of the sentence.
  - Example: "The quick brown ele - phant jumps over the lazy dog" should be preserved as is, with hyphen and spaces.
  3. If a sentence continues on the next page, set the continuesOnNextPage flag to true.
  
  ---
  Here is the PDF page image:
  `;
  try {
    const r = (await Nn.chat.completions.create({
      model: "gpt-4o-2024-11-20",
      messages: [
        {
          role: "system",
          content: t
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this PDF page screenshot and extract the structure information according to the schema."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${e}`
              }
            }
          ]
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "page_structure_analysis",
          strict: !0,
          schema: {
            type: "object",
            properties: {
              sections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string"
                    },
                    readingRelevance: {
                      type: "number"
                    },
                    sentences: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          sentenceText: {
                            type: "string"
                          },
                          continuesOnNextPage: {
                            type: "boolean"
                          }
                        },
                        required: ["sentenceText", "continuesOnNextPage"],
                        additionalProperties: !1
                      }
                    }
                  },
                  required: ["title", "readingRelevance", "sentences"],
                  additionalProperties: !1
                }
              }
            },
            required: ["sections"],
            additionalProperties: !1
          }
        }
      }
    })).choices[0].message.content;
    if (!r)
      throw new Error("No content in LLM response");
    const a = JSON.parse(r), i = cr.parse(a), o = To(i);
    return Ro && Io && await Po(
      o,
      "analyzePageStructureFixture"
    ), o;
  } catch (n) {
    throw console.error("Error analyzing page structure:", n), n;
  }
}
async function $o(s) {
  return new Promise((e, t) => {
    const n = new FileReader();
    n.onload = () => {
      const a = n.result.split(",")[1];
      e(a);
    }, n.onerror = t, n.readAsDataURL(s);
  });
}
function To(s) {
  return {
    sections: s.sections.filter(
      (e) => e.readingRelevance === 5
    )
  };
}
class Oo {
  constructor(e) {
    Pe(this, "sectionIndex", 0);
    Pe(this, "sentenceIndex", 0);
    Pe(this, "wordIndex", 0);
    Pe(this, "allSentences");
    Pe(this, "currentSentence", null);
    this.wordMap = e, this.allSentences = e.sections.flatMap((t) => t.sentences), this.currentSentence = this.allSentences.length > 0 ? this.allSentences[0] : null;
  }
  next() {
    if (!this.currentSentence || this.sentenceIndex >= this.allSentences.length)
      return {
        sentence: null,
        word: null,
        wordIndex: -1,
        sentenceIndex: -1,
        sectionIndex: -1,
        done: !0
      };
    if (this.wordIndex >= this.currentSentence.words.length) {
      if (this.sentenceIndex++, this.wordIndex = 0, this.sentenceIndex >= this.allSentences.length)
        return {
          sentence: null,
          word: null,
          wordIndex: -1,
          sentenceIndex: -1,
          sectionIndex: -1,
          done: !0
        };
      this.currentSentence = this.allSentences[this.sentenceIndex];
      let n = 0;
      for (let r = 0; r < this.wordMap.sections.length; r++)
        if (n += this.wordMap.sections[r].sentences.length, this.sentenceIndex < n) {
          this.sectionIndex = r;
          break;
        }
    }
    const e = this.currentSentence.words[this.wordIndex], t = {
      sentence: this.currentSentence,
      word: e,
      wordIndex: this.wordIndex,
      sentenceIndex: this.sentenceIndex,
      sectionIndex: this.sectionIndex,
      done: !1
    };
    return this.wordIndex++, console.log(
      `📖 Step ${this.sentenceIndex + 1}.${this.wordIndex}: "${e.word}" (${e.textContent}) at position ${e.matchStartPosition}`
    ), this.highlightWord(e), t;
  }
  highlightWord(e) {
    var t, n;
    try {
      const r = (t = window.PDFViewerApplication) == null ? void 0 : t.eventBus, a = (n = window.PDFViewerApplication) == null ? void 0 : n.findController;
      if (!r || !a) {
        console.warn("PDF.js components not available for highlighting");
        return;
      }
      a._scrollMatches = !0, r.dispatch("findbarclose", { source: null }), r.dispatch("find", {
        source: null,
        type: "highlightallchange",
        query: e.word,
        caseSensitive: !1,
        entireWord: !0,
        highlightAll: !1,
        // Only highlight one occurrence
        findPrevious: !1,
        matchDiacritics: !1
      }), setTimeout(() => {
        try {
          const i = a._pageMatches[e.pageIndex];
          if (i) {
            const o = i.findIndex(
              (c) => c === e.matchStartPosition
            );
            o >= 0 ? (a._selected.pageIdx = e.pageIndex, a._selected.matchIdx = o, a._offset.pageIdx = e.pageIndex, a._offset.matchIdx = o, a._eventBus.dispatch("updatetextlayermatches", {
              source: a,
              pageIndex: e.pageIndex
            }), console.log(
              `✨ Highlighted "${e.word}" at position ${e.matchStartPosition} (match ${o})`
            )) : console.warn(
              `Could not find match index for word "${e.word}" at position ${e.matchStartPosition}`
            );
          }
        } catch (i) {
          console.warn("Error setting specific word highlight:", i);
        }
      }, 100);
    } catch (r) {
      console.warn("Error highlighting word:", r);
    }
  }
  clearHighlights() {
    var e, t;
    try {
      const n = (e = window.PDFViewerApplication) == null ? void 0 : e.eventBus, r = (t = window.PDFViewerApplication) == null ? void 0 : t.findController;
      n && r && (n.dispatch("findbarclose", { source: null }), r._scrollMatches = !1, console.log("🧹 Cleared all highlights and disabled scrolling"));
    } catch (n) {
      console.warn("Error clearing highlights:", n);
    }
  }
}
function Fo(s, e, t, n) {
  for (const r of n.sections)
    for (const a of r.sentences)
      if (a.location.pageIndex === t) {
        const i = a.location.matchStartPosition, o = i + a.location.matchLength, c = s + e;
        if (s >= i && c <= o)
          return a;
      }
}
async function No(s, e) {
  var o, c, l;
  const t = (o = window.PDFViewerApplication) == null ? void 0 : o.eventBus, n = (c = window.PDFViewerApplication) == null ? void 0 : c.findController, r = (l = window.PDFViewerApplication) == null ? void 0 : l.pdfViewer;
  if (!t || !n || !r)
    throw new Error("PDF.js components not available for testing");
  const a = r.currentPageNumber - 1, i = await Oa(
    s,
    a,
    t,
    n,
    e
  );
  return console.log(
    `🧪 Found ${i.length} locations for "${s}"${e ? ` (${i.filter((d) => d.parentSentence).length} with parent sentences)` : ""}`
  ), i;
}
async function Mo(s, e) {
  var d, u;
  console.log("🗺️ Building word map from page structure...");
  const t = e.currentPageNumber - 1, n = (d = window.PDFViewerApplication) == null ? void 0 : d.eventBus, r = (u = window.PDFViewerApplication) == null ? void 0 : u.findController;
  if (!n || !r)
    throw new Error("PDF.js event bus or find controller not available");
  const a = e.container, i = a.scrollTo, o = a.scrollTop, c = a.scrollLeft;
  a.scrollTo = () => {
  }, Object.defineProperty(a, "scrollTop", {
    get: () => o,
    set: () => {
    },
    // Ignore all scroll attempts
    configurable: !0
  }), Object.defineProperty(a, "scrollLeft", {
    get: () => c,
    set: () => {
    },
    // Ignore all scroll attempts
    configurable: !0
  });
  const l = r._scrollMatches;
  r._scrollMatches = !1;
  try {
    await new Promise((p) => setTimeout(p, 500));
    const f = [];
    for (const p of s.sections) {
      const E = [];
      for (const m of p.sentences)
        try {
          const k = await Do(
            m,
            t,
            n,
            r
          );
          if (k) {
            const S = {
              ...m,
              location: k,
              words: []
              // Will be populated after all sentences are processed
            };
            E.push(S);
          }
        } catch {
          console.warn(
            `⚠️ Skipping sentence due to error: "${m.sentenceText}"`
          );
        }
      f.push({
        title: p.title,
        readingRelevance: p.readingRelevance,
        sentences: E
      });
    }
    const g = f.reduce(
      (p, E) => p + E.sentences.length,
      0
    );
    console.log(
      `🗺️ Found ${g} sentences across ${f.length} sections`
    ), console.log("🔤 Finding words for each sentence...");
    for (const p of f)
      for (const E of p.sentences) {
        const m = E.sentenceText.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter((k) => k.length > 0);
        for (const k of m)
          try {
            const D = (await Oa(
              k,
              t,
              n,
              r,
              {
                sections: f,
                getLocationForSentence: () => null,
                traverse: () => {
                  throw new Error(
                    "Traverse not available during word population"
                  );
                }
              }
              // Provide minimal WordMap
            )).filter(
              (O) => {
                var $;
                return (($ = O.parentSentence) == null ? void 0 : $.sentenceText) === E.sentenceText;
              }
            );
            E.words.push(...D);
          } catch {
          }
      }
    const x = f.reduce(
      (p, E) => p + E.sentences.reduce(
        (m, k) => m + k.words.length,
        0
      ),
      0
    );
    console.log(
      `✅ WordMap complete: ${g} sentences with ${x} located words`
    );
    const y = {
      sections: f,
      getLocationForSentence: (p) => {
        for (const E of f)
          for (const m of E.sentences)
            if (m.sentenceText === p)
              return m.location;
        return null;
      },
      traverse: () => new Oo(y)
    };
    return y;
  } finally {
    a.scrollTo = i, Object.defineProperty(a, "scrollTop", {
      get: function() {
        return this._scrollTop || 0;
      },
      set: function(f) {
        this._scrollTop = f, this.scrollTo(this.scrollLeft, f);
      },
      configurable: !0
    }), Object.defineProperty(a, "scrollLeft", {
      get: function() {
        return this._scrollLeft || 0;
      },
      set: function(f) {
        this._scrollLeft = f, this.scrollTo(f, this.scrollTop);
      },
      configurable: !0
    }), a.scrollTo(c, o), r._scrollMatches = l, console.log("🔄 Restored original scroll behavior");
  }
}
async function Oa(s, e, t, n, r) {
  var l;
  const a = (l = window.PDFViewerApplication) == null ? void 0 : l.pdfViewer, i = a == null ? void 0 : a.container, o = (i == null ? void 0 : i.scrollTop) || 0, c = (i == null ? void 0 : i.scrollLeft) || 0;
  return new Promise((d) => {
    t.dispatch("findbarclose", { source: null }), t.dispatch("find", {
      source: null,
      type: "highlightallchange",
      query: s,
      caseSensitive: !1,
      entireWord: !0,
      // Use entire word matching for words
      highlightAll: !0,
      findPrevious: !1,
      matchDiacritics: !1
    }), n._scrollMatches = !1;
    const u = () => {
      var x, y;
      const f = n._pageMatches, g = n._pageMatchesLength;
      if (f && g) {
        const p = [];
        for (let E = 0; E < f.length; E++) {
          const m = f[E], k = g[E];
          if (m && k && m.length > 0)
            for (let S = 0; S < m.length; S++) {
              const D = m[S], O = k[S], $ = {
                word: s,
                pageIndex: E,
                matchStartPosition: D,
                matchLength: O
              };
              try {
                if (a) {
                  const q = (x = a._pages) == null ? void 0 : x[E];
                  if ((y = q == null ? void 0 : q.textLayer) != null && y.div) {
                    const j = q.textLayer.div.textContent || "";
                    if (j) {
                      const B = D + O;
                      $.textContent = j.substring(
                        D,
                        B
                      );
                    }
                  }
                }
              } catch {
              }
              r && ($.parentSentence = Fo(
                D,
                O,
                E,
                r
              )), p.push($);
            }
        }
        i && (i.scrollTop = o, i.scrollLeft = c), d(p);
        return;
      } else
        setTimeout(u, 100);
    };
    setTimeout(u, 100);
  });
}
async function Do(s, e, t, n) {
  var c;
  const r = (c = window.PDFViewerApplication) == null ? void 0 : c.pdfViewer, a = r == null ? void 0 : r.container, i = (a == null ? void 0 : a.scrollTop) || 0, o = (a == null ? void 0 : a.scrollLeft) || 0;
  return new Promise((l) => {
    t.dispatch("findbarclose", { source: null }), t.dispatch("find", {
      source: null,
      type: "highlightallchange",
      query: s.sentenceText,
      caseSensitive: !1,
      entireWord: !1,
      highlightAll: !0,
      findPrevious: !1,
      matchDiacritics: !1
    }), n._scrollMatches = !1;
    const d = () => {
      var g;
      const u = n._pageMatches, f = n._pageMatchesLength;
      if (u && f) {
        for (let x = 0; x < u.length; x++) {
          const y = u[x], p = f[x];
          if (y && p && y.length > 0) {
            const E = {
              pageIndex: x,
              matchStartPosition: y[0],
              matchLength: p[0]
            };
            try {
              const m = (g = n._extractText) == null ? void 0 : g[x];
              if (m) {
                const k = y[0], S = k + p[0];
                E.textContent = m.substring(k, S);
              }
            } catch (m) {
              console.warn("Could not extract text content:", m);
            }
            a && (a.scrollTop = i, a.scrollLeft = o), l(E);
            return;
          }
        }
        a && (a.scrollTop = i, a.scrollLeft = o), l(null);
        return;
      } else
        setTimeout(d, 100);
    };
    setTimeout(d, 100);
  });
}
async function Lo(s) {
  const t = await (await Nn.audio.speech.create({
    model: "gpt-4o-mini-tts",
    input: s,
    voice: "alloy",
    speed: 0.9,
    response_format: "wav"
  })).arrayBuffer(), n = new File([t], "speech.wav", { type: "audio/wav" }), r = await Nn.audio.transcriptions.create({
    file: n,
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word"]
  });
  return {
    audioBuffer: t,
    transcription: r,
    originalSentenceText: s
  };
}
async function lr({
  sentences: s,
  fixtureKey: e
}) {
  if (!s || s.length === 0)
    throw new Error("No sentences to prepare audio for!");
  if (e)
    try {
      const n = await ko(e);
      if (n && n.length > 0)
        return n;
    } catch (n) {
      console.warn(
        `Failed to load fixtures for ${e}, falling back to OpenAI:`,
        n
      );
    }
  console.log(`Generating audio for ${s.length} sentences...`);
  const t = await Promise.all(
    s.map(async (n) => await Lo(n.sentenceText))
  );
  return e && t && await vo(t, e), t;
}
function Bo({
  shouldEnable: s,
  onClick: e
}) {
  const t = document.getElementById("readButton");
  if (!t)
    throw new Error("Read button not found");
  s() && (t.disabled = !1, t.onclick = e);
}
function jo() {
  const s = document.getElementById("readButton");
  if (!s)
    throw new Error("Read button not found");
  s.disabled = !0, s.onclick = null;
}
async function Uo({
  audioItem: s,
  onEnd: e
}) {
  try {
    console.log("Playing audio:", s.transcription.text);
    const t = new (window.AudioContext || window.webkitAudioContext)(), n = await t.decodeAudioData(
      s.audioBuffer
    ), r = t.createBufferSource();
    return r.buffer = n, r.connect(t.destination), new Promise((a) => {
      r.onended = () => {
        e(), a();
      }, r.start();
    });
  } catch (t) {
    throw console.error("Error playing audio:", t), t;
  }
}
class ur {
  constructor() {
    Pe(this, "startTime", null);
  }
  start() {
    this.startTime = performance.now();
  }
  stop() {
    this.startTime = null;
  }
  reset() {
    this.startTime !== null && (this.startTime = performance.now());
  }
  getElapsedSeconds() {
    return this.startTime === null ? 0 : (performance.now() - this.startTime) / 1e3;
  }
  hasTimeStampPassed(e) {
    return this.startTime === null ? !1 : this.getElapsedSeconds() >= e;
  }
  isRunning() {
    return this.startTime !== null;
  }
}
async function dr(s, e) {
  if (!ot || ot.length === 0) {
    console.error("No audio data available");
    return;
  }
  for (const t of ot) {
    let n = [];
    if (e) {
      const a = zo(
        t.originalSentenceText,
        e
      );
      a ? (n = a.words, console.log(
        `🎯 Synced audio sentence with WordMap: "${t.originalSentenceText}" (${n.length} words)`
      )) : console.warn(
        `⚠️ Could not find sentence in WordMap: "${t.originalSentenceText}"`
      );
    }
    const r = Zo(
      t,
      n
    );
    await Uo({
      audioItem: t,
      onEnd: () => {
        r.stop();
      }
    });
  }
  e && Ho();
}
let ot = null, Mn = 0;
function Wo(s) {
  return s === Mn;
}
function hr(s) {
  ot = s;
}
function Vo() {
  return ot = null, Mn++, Mn;
}
function Zo(s, e) {
  const t = s.transcription.words;
  if (!t || t.length === 0)
    return console.warn("No word-level timestamps available"), new ur();
  console.log(
    "🔧 [DEBUG] Starting word tracking for:",
    s.originalSentenceText
  ), console.log(
    "🔧 [DEBUG] Audio words:",
    t.map((o) => ({ word: o.word, start: o.start, end: o.end }))
  ), console.log(
    "🔧 [DEBUG] PDF words from map:",
    e.map((o, c) => ({
      index: c,
      word: o.word,
      position: o.matchStartPosition,
      page: o.pageIndex
    }))
  ), console.log("🔧 [DEBUG] Creating main thread timer...");
  const n = new ur();
  n.start();
  let r = 0;
  const a = /* @__PURE__ */ new Set(), i = () => {
    if (!n.isRunning() || r >= t.length)
      return;
    const o = t[r];
    if (n.hasTimeStampPassed(o.start)) {
      if (e.length > 0) {
        const c = Jo(
          o.word,
          e,
          a
        );
        c ? (console.log(
          `🎯 [DEBUG] Audio word "${o.word}" → PDF word "${c.word}" at position ${c.matchStartPosition} (index ${c.index})`
        ), qo(c), a.add(c.index)) : console.warn(
          `⚠️ [DEBUG] Could not find matching PDF word for audio word "${o.word}"`
        );
      } else
        console.log(
          `📖 [DEBUG] Currently reading word: "${o.word}" at ${o.start}s (no PDF words available)`
        );
      r++;
    }
    r < t.length && setTimeout(i, 10);
  };
  return console.log("🔧 [DEBUG] Starting word tracking loop..."), i(), n;
}
function Jo(s, e, t) {
  console.log(
    `🔍 [DEBUG] Looking for PDF word matching audio word "${s}"`
  );
  const n = s.toLowerCase().replace(/[^\w]/g, ""), r = [];
  for (let i = 0; i < e.length; i++) {
    if (t.has(i))
      continue;
    const o = e[i];
    o.word.toLowerCase().replace(/[^\w]/g, "") === n && r.push({ ...o, index: i });
  }
  if (console.log(
    `🔍 [DEBUG] Found ${r.length} unused candidates for "${s}":`,
    r.map(
      (i) => `"${i.word}" at position ${i.matchStartPosition} (index ${i.index})`
    )
  ), r.length === 0)
    return null;
  const a = r[0];
  return console.log(
    `✅ [DEBUG] Selected PDF word "${a.word}" at position ${a.matchStartPosition} (index ${a.index})`
  ), a;
}
function zo(s, e) {
  console.log(`🔍 [DEBUG] Looking for sentence in WordMap: "${s}"`);
  for (const t of e.sections)
    for (const n of t.sentences)
      if (n.sentenceText === s)
        return console.log(
          `✅ [DEBUG] Found sentence with ${n.words.length} words:`
        ), n.words.forEach((r, a) => {
          console.log(
            `  ${a + 1}. "${r.word}" at position ${r.matchStartPosition} on page ${r.pageIndex}`
          );
        }), n;
  return console.warn(
    "❌ [DEBUG] Sentence not found in WordMap. Available sentences:"
  ), e.sections.forEach((t, n) => {
    t.sentences.forEach((r, a) => {
      console.log(
        `  ${n}.${a}: "${r.sentenceText}"`
      );
    });
  }), null;
}
function qo(s) {
  var e, t;
  console.log(
    `🎨 [DEBUG] Highlighting word from map: "${s.word}" at position ${s.matchStartPosition} on page ${s.pageIndex}`
  );
  try {
    const n = (e = window.PDFViewerApplication) == null ? void 0 : e.eventBus, r = (t = window.PDFViewerApplication) == null ? void 0 : t.findController;
    if (!n || !r) {
      console.warn("PDF.js components not available for highlighting");
      return;
    }
    r._scrollMatches = !0, n.dispatch("findbarclose", { source: null }), n.dispatch("find", {
      source: null,
      type: "highlightallchange",
      query: s.word,
      caseSensitive: !1,
      entireWord: !0,
      highlightAll: !1,
      // Only highlight one occurrence
      findPrevious: !1,
      matchDiacritics: !1
    }), setTimeout(() => {
      try {
        const a = r._pageMatches[s.pageIndex];
        if (a) {
          const i = a.findIndex(
            (o) => o === s.matchStartPosition
          );
          i >= 0 ? (r._selected.pageIdx = s.pageIndex, r._selected.matchIdx = i, r._offset.pageIdx = s.pageIndex, r._offset.matchIdx = i, r._eventBus.dispatch("updatetextlayermatches", {
            source: r,
            pageIndex: s.pageIndex
          }), console.log(
            `✨ [DEBUG] Successfully highlighted ONLY "${s.word}" at exact position ${s.matchStartPosition} (match ${i})`
          )) : console.warn(
            `❌ [DEBUG] Could not find match for position ${s.matchStartPosition}. Available positions:`,
            a
          );
        } else
          console.warn(
            `❌ [DEBUG] No matches found for "${s.word}" on page ${s.pageIndex}`
          );
      } catch (a) {
        console.warn("Error setting specific word highlight:", a);
      }
    }, 100);
  } catch (n) {
    console.warn("Error highlighting word:", n);
  }
}
function Ho() {
  var s, e;
  try {
    const t = (s = window.PDFViewerApplication) == null ? void 0 : s.eventBus, n = (e = window.PDFViewerApplication) == null ? void 0 : e.findController;
    t && n && (t.dispatch("findbarclose", { source: null }), n._scrollMatches = !1, console.log("🧹 Cleared all highlights and disabled scrolling"));
  } catch (t) {
    console.warn("Error clearing highlights:", t);
  }
}
async function Xo(s) {
  try {
    const { getCurrentPage: e, pdfDocument: t, getTitle: n, pdfViewer: r } = await La(), a = await Ba({
      getCurrentPage: e,
      pdfDocument: t,
      getTitle: n
    }), i = await Eo(a);
    console.log("Reading preparation complete:", i);
    const o = await Mo(i, r);
    console.log("Word map built:", o), window.wordMap = o, console.log(
      "🧪 WordMap integrated with audio! Manual API: wordMap.traverse() in console"
    );
    const {
      sections: [c, ...l]
    } = i, d = await lr({
      sentences: c.sentences,
      fixtureKey: "audioForFirstSection"
    });
    if (d) {
      console.log("Audio for first section prepared:", d), hr(d), Bo({
        shouldEnable: () => Wo(s),
        onClick: async () => {
          await u(), await dr(r, o);
        }
      });
      async function u() {
        const f = lr({
          sentences: l.flatMap((x) => x.sentences),
          fixtureKey: "audioForRestOfSections"
        });
        await dr(r, o);
        const g = await f;
        if (!g) {
          console.error("No audio for the rest of the sections");
          return;
        }
        console.log(
          "Audio for the rest of the sections prepared:",
          g
        ), hr(g);
      }
    }
  } catch (e) {
    console.error("Analysis failed:", e);
  }
}
function Fa() {
  var e;
  const s = (e = window.PDFViewerApplication) == null ? void 0 : e.eventBus;
  s ? s._on("documentloaded", () => {
    console.log("📄 New PDF loaded - running reading preparation..."), jo();
    const t = Vo();
    setTimeout(() => Xo(t), 100);
  }) : (console.warn("EventBus not available, trying fallback..."), setTimeout(Fa, 1e3));
}
Fa();
window.testWordLocation = No;
console.log(
  "🧪 Word location testing available! Use: testWordLocation('your-word') or testWordLocation('your-word', wordMap) in console"
);
//# sourceMappingURL=main.js.map
