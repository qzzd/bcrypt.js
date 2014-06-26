var path = require("path"),
    fs = require("fs"),
    binding = require("bcrypt"),
    bcrypt = require(path.join(__dirname, '..', 'index.js'));
    
module.exports = {
    
    "genSaltSync": function(test) {
        var salt = bcrypt.genSaltSync(10);
        test.ok(salt);
        test.ok(typeof salt == 'string');
        test.ok(salt.length > 0);
        test.done();
    },
    
    "genSalt": function(test) {
        bcrypt.genSalt(10, function(err, salt) {
            test.ok(salt);
            test.ok(typeof salt == 'string');
            test.ok(salt.length > 0);
            test.done();
        });
    },
    
    "hashSync": function(test) {
        test.doesNotThrow(function() {
            bcrypt.hashSync("hello", 10);
        });
        test.notEqual(bcrypt.hashSync("hello", 10), bcrypt.hashSync("hello", 10));
        test.done();
    },
    
    "hash": function(test) {
        bcrypt.hash("hello", 10, function(err, hash) {
            test.notOk(err);
            test.ok(hash);
            test.done();
        });
    },
    
    "compareSync": function(test) {
        var salt1 = bcrypt.genSaltSync(),
            hash1 = bcrypt.hashSync("hello", salt1); // $2a$
        var salt2 = bcrypt.genSaltSync();
        salt2 = salt2.substring(0,2)+'y'+salt2.substring(3); // $2y$
        var hash2 = bcrypt.hashSync("world", salt2);
        test.ok(bcrypt.compareSync("hello", hash1));
        test.notOk(bcrypt.compareSync("hello", hash2));
        test.ok(bcrypt.compareSync("world", hash2));
        test.notOk(bcrypt.compareSync("world", hash1));
        test.done();
    },
    
    "compare": function(test) {
        var salt1 = bcrypt.genSaltSync(),
            hash1 = bcrypt.hashSync("hello", salt1); // $2a$
        var salt2 = bcrypt.genSaltSync();
        salt2 = salt2.substring(0,2)+'y'+salt2.substring(3); // $2y$
        var hash2 = bcrypt.hashSync("world", salt2);
        bcrypt.compare("hello", hash1, function(err, same) {
            test.notOk(err);
            test.ok(same);
            bcrypt.compare("hello", hash2, function(err, same) {
                test.notOk(err);
                test.notOk(same);
                bcrypt.compare("world", hash2, function(err, same) {
                    test.notOk(err);
                    test.ok(same);
                    bcrypt.compare("world", hash1, function(err, same) {
                        test.notOk(err);
                        test.notOk(same);
                        test.done();
                    });
                });
            });
        });
    },
    
    "getSalt": function(test) {
        var hash1 = bcrypt.hashSync("hello", bcrypt.genSaltSync());
        test.log("Hash: "+hash1);
        var salt = bcrypt.getSalt(hash1);
        test.log("Salt: "+salt);
        var hash2 = bcrypt.hashSync("hello", salt);
        test.equal(hash1, hash2);
        test.done();
    },
    
    "getRounds": function(test) {
        var hash1 = bcrypt.hashSync("hello", bcrypt.genSaltSync());
        test.equal(bcrypt.getRounds(hash1), 10);
        test.done();
    },
    
    "compat": function(test) {
        var pass = fs.readFileSync(path.join(__dirname, "quickbrown.txt"))+"",
            salt = bcrypt.genSaltSync(),
            hash1 = binding.hashSync(pass, salt),
            hash2 = bcrypt.hashSync(pass, salt);
        test.equal(hash1, hash2);
        test.done();
    }
};
