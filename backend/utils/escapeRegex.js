// Escapes regex metacharacters so user-supplied search text can't be used
// to inject arbitrary regex (ReDoS) into a Mongo $regex query.
export const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
