const A41 = function(name, quirk) {
  if (!A41.hasOwnProperty('quirks')) A41.quirks = new Map();
  if (A41.quirks.has(name)) throw new Error('mixin already created');

  A41.quirks.set(name, quirk);
  let fn = function(state) {
    if (fn.owners.has(state)) throw new Error(`${state} already has ${name}$`);
    let obj = Object.create(null);

    // ability to removeQuirk from user
    quirk.removeQuirk = () => deleteQuirk(state, name);

    // ability to use quirk
    obj[name] = quirk;

    // keep track of who possess quirk
    fn.owners.add(state);
    fn.title = name;
    // return the new version of the user with quirk ability
    return Object.assign(state, obj);
  };

  // store name of quirk and the constructor in a41
  A41.quirks.set(name, fn);
  // quirk is created first time, attached to the mixin includes a list of everyone who posses said quirk.
  fn.owners = new Set();
  fn.name = name;

  //quirk.removeQuirk = deleteQuirk(;

  return fn;
};

const banishQuirk = function(quirk) {
  if (!A41.quirks.has(quirk)) throw new Error(`no quirk ${quirk} exists`);

  let owners = A41.quirks.get(quirk).owners;

  for (let owner of owners) {
    deleteQuirk(owner, quirk);
    console.log(`removed ${quirk} from ${owner.name}`);
  }

  delete A41.quirks.delete(quirk);
  console.log(`A41 has banished ${quirk} from existance`);
};

const bestowQuirks = function(user, ...quirks) {
  if (typeof user === 'string' || user instanceof String) {
    // generating new user object with name //only makes sense if everythign will have a name
    user = { name: user };
  }
  let response = `${user.name} given: `;
  for (let quirk of quirks) {
    try {
      user = quirk(user);
      response += `${quirk.title}, `;
    } catch (e) {
      response += `not ${quirk.title} cuz of ${e}, `;
    }
  }
  console.log(response);
  return user;
};

// On User
const deleteQuirk = function(user, trait /*as string*/) {
  let generator = A41.quirks.get(trait);

  // deletes user from quirk owners list
  generator.owners.delete(user);

  // deletes quirk from user
  delete user[trait];
};

export const API = {
  A41,
  banishQuirk,
  bestowQuirks,
  deleteQuirk
};
