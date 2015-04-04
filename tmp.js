var isWirelessMode = !1,
    langLocalisation = "en",
    showEnergyConnections = !1,
    worldTimeIndexAdd = 0;
ModPE.setItem_ = ModPE.setItem;
ModPE.setItem = function(a, c, d, e, f) {
    allRecipesAdded || (f || (f = 64), ModPE.setItem_(a, c, d, e, f), Player.addItemCreativeInv(a, f, 0))
};
Item.addShapedRecipe_ = Item.addShapedRecipe;
Item.addShapedRecipe = function(a, c, d, e, f) {
    Item.addShapedRecipe_(a, c, d, e, f);
    var g = [],
        h = {};
    e = e[0] + e[1] + e[2];
    a = a + ":" + c + ":" + d;
    for (c = 0; c < f.length / 3; c++) h[f[3 * c]] = [f[3 * c + 1], f[3 * c + 2]];
    for (c = 0; 9 > c; c++)(f = h[e.charAt(c)]) ? (g.push(f[0]), g.push(f[1])) : (g.push(0), g.push(0));
    AutoCraftRecipeList[a] = g
};

function BindEntityToPosition(a, c, d, e) {
    var f = Entity.getX(a),
        g = Entity.getY(a),
        h = Entity.getZ(a);
    setVelX(a, c - f);
    setVelY(a, d - g);
    setVelZ(a, e - h)
}
var SoundPlayers = [];

function PlaySoundFile(a) {
    try {
        if (5 < SoundPlayers.length) return null;
        var c = null,
            d;
        for (d in SoundPlayers) {
            var e = SoundPlayers[d];
            if (!e.isPlaying()) {
                c = e;
                break
            }
        }
        null == c && (c = new android.media.MediaPlayer, SoundPlayers.push(c));
        c.reset();
        c.setDataSource(new android.os.Environment.getExternalStorageDirectory + "/games/com.mojang/FactorizationSound/" + a);
        c.prepare();
        c.start();
        return c
    } catch (f) {
        ModPE.log("No FZ sounds;(")
    }
    return c
}
Block.setLightOpacity || (print("needs launcher 1.8.6"), Block.setLightOpacity = function() {});
var FStats = {};

function HookFunc(a, c) {
    return function(d, e, f, g, h, k, l, m) {
        FStats[c] || (FStats[c] = 0);
        FStats[c]++;
        return a(d, e, f, g, h, k, l, m)
    }
}

function UpdateFunctionStats() {
    if (0 == globalWorldTime % 20) {
        var a = 10,
            c;
        for (c in FStats) clientMessage(c + " - " + FStats[c]), FStats[c] = 0, a--;
        for (c = 0; c < a; c++) clientMessage(".")
    }
}
var outputTitleMessage = "factorization by zheka_smirnov";

function MachineBase() {
    this.MachineCoords = [];
    this.MachineItems = [];
    this.id = -1;
    this.tickRate = 1;
    this.clear = function() {
        this.MachineCoords = [];
        this.MachineItems = []
    };
    this.isUsingEnergy = function() {
        return !1
    };
    this.isGenerator = function() {
        return !1
    };
    this.SoundPlayers = [];
    this.playSound = function(a, c, d) {
        d || (d = 24);
        var e = getPlayerX() - a.x,
            f = getPlayerY() - a.y,
            g = getPlayerZ() - a.z;
        a = a.uniquieID;
        var h = this.SoundPlayers;
        if (e * e + f * f + g * g < d * d) try {
            var k = h[a];
            k || (k = new android.media.MediaPlayer);
            h[a] = k;
            k.isPlaying() && k.stop();
            k.reset();
            k.setDataSource(new android.os.Environment.getExternalStorageDirectory + "/games/com.mojang/FactorizationSound/" + c);
            k.prepare();
            k.start()
        } catch (l) {}
    };
    this.stopSound = function(a) {
        (a = this.SoundPlayers[a.uniqueID]) && a.stop()
    };
    this.convertEnergyToFuel = function(a, c) {
        this.getEnergyStored(a);
        for (var d = 0; a.energyStored > c;) d++, a.energyStored -= c;
        return d
    };
    this.getMaxEnergyStored = function() {
        return 0
    };
    this.getEnergyStored = function(a) {
        a.energyStored || (a.energyStored = 0);
        return a.energyStored
    };
    this.getEnergyOutput =
        function(a) {
            return 0
        };
    this.useEnergy = function(a, c) {
        a.energyStored || (a.energyStored = 0);
        if (a.energyStored < c) return !1;
        a.energyStored -= c;
        return !0
    };
    this.tickResetType = function() {};
    this.updateMachineType = function() {
        var a = Level.getTime(),
            c = 0 == a % this.tickRate,
            d;
        for (d in this.MachineCoords) {
            var e = this.MachineCoords[d];
            if (!e.disactive && (e.isActivated && c && this.updateMachine(e), 0 == a % 4 && e.container && (e.container.setEnergyBar(this.getEnergyStored(e) / this.getMaxEnergyStored()), e.container.updateGUI()), this.isUsingEnergy())) {
                var f =
                    0;
                e.isActivated && e.webObj && (f = this.getEnergyOutput(e)) && (f = e.webObj.addEnergy(f, e.uniqueID)) && addEnergyToSinglerMachine(e, f, 1);
                worldTimeIndexAdd++
            }
        }
    };
    this.addItem = function(a, c, d, e) {
        a = Level.dropItem(a.x, a.y, a.z, 1, c, d, e);
        c = new DroppedItem(a, c, d, e);
        c.hold();
        this.MachineItems.push(c);
        return c
    };
    this.updateItem = function(a) {};
    this.updateMachine = function(a) {};
    this.save = function(a, c) {};
    this.read = function(a, c) {};
    this.wrenchClick = function(a) {};
    this.canDeactivate = function() {
        return !0
    };
    this.getMachineName = function() {
        return "machine"
    };
    this.getInfo = function(a) {
        return ""
    };
    this.onDestroy = function(a) {};
    this.getContainerId = function() {
        return -1
    };
    this.getContainer = function(a) {
        if (!a.container) {
            var c = this.getContainerId();
            a.container = -1 == c ? null : new Container(c)
        }
        return a.container
    };
    this.tryOpenGUI = function(a) {
        var c = this.getContainer(a);
        return c ? (GUIBuildData = this.getGUIMetadata(a), c.open(), !0) : !1
    };
    this.getGUIMetadata = function(a) {
        return 0
    }
}

function Coords(a, c, d) {
    this.x = a;
    this.y = c;
    this.z = d
}

function DroppedItem(a, c, d, e) {
    this.e = a;
    this.id = c;
    this.count = d;
    this.data = e;
    this.hold = function() {
        setVelX(this.e, 0);
        setVelY(this.e, 0);
        setVelZ(this.e, 0)
    };
    this.getCoords = function() {
        return Coords(parseInt(Entity.getX(this.e)), parseInt(Entity.getY(this.e)), parseInt(Entity.getZ(this.e)))
    };
    this.isExist = function() {
        return 0 < Entity.getHealth(this.e)
    }
}
var CachedChestInventory = [];

function ChestInventory(a, c, d) {
    this.x = a;
    this.y = c;
    this.z = d;
    this.slots = [];
    this.lastSync = -999;
    this.isExist = function() {
        return 54 == getTile(this.x, this.y, this.z)
    };
    this.exist = this.isExist();
    this.getSlot = function(a) {
        if (!this.exist) return {
            id: 0,
            count: 0,
            data: 0
        };
        this.syncSlot();
        return this.slots[a]
    };
    this.synced = function() {
        return this.lastSync == Level.getTime()
    };
    this.setSlot = function(a, c, d, h) {
        this.exist && (0 == d && (h = c = 0), this.slots[a] = {
            id: c,
            count: d,
            data: h
        }, this.exist && Level.setChestSlot(this.x, this.y, this.z, a, c,
            h, d))
    };
    this.getChestSize = function() {
        return 27
    };
    this.isStakable = function(a) {
        return !(473 == a || 474 == a || 475 == a)
    };
    this.addItem = function(a, c, d) {
        c = parseInt(c);
        if (!this.exist) return c;
        d || (d = 0);
        var h = this.isStakable(a);
        this.sync();
        for (var k = this.getChestSize(), l = 0; l < k && 0 != c; l++) {
            var m = this.slots[l];
            if (h && m.id == a && m.data == d || 0 == m.id) {
                var n = m.count;
                m.count += c;
                64 < m.count && (m.count = 64);
                c -= m.count - n;
                this.setSlot(l, a, m.count, d)
            }
        }
        return c
    };
    this.syncSlot = function(a) {
        var c = Level.getChestSlot(this.x, this.y, this.z, a),
            d = Level.getChestSlotCount(this.x, this.y, this.z, a),
            h = Level.getChestSlotData(this.x, this.y, this.z, a);
        this.slots[a] = {
            id: c,
            count: d,
            data: h
        }
    };
    this.getItem = function(a, c, d) {
        if (!this.exist) return {
            id: a,
            count: 0,
            data: d
        };
        d || (d = 0);
        var h = 0,
            k = a;
        lastData = d;
        this.sync();
        for (var l = this.getChestSize(), m = 0; m < l && !(h >= c); m++) {
            var n = this.slots[m];
            if ((n.id == a && (n.data == d || -1 == d) || -1 == a && 0 != n.id) && (-1 != a || !this.checkExclude(n.id, n.data)) && (k = Math.min(n.count, c - h), n.count -= k, h += k, k = n.id, lastData = n.data, this.setSlot(m, n.id, n.count,
                    n.data), -1 == a)) break
        }
        return {
            id: k,
            count: h,
            data: lastData
        }
    };
    this.excluding = [];
    this.setExclude = function(a) {
        this.excluding = a
    };
    this.getItemTypeList = function() {
        this.sync();
        if (!this.exist) return [];
        for (var a = [], c = 0; 27 > c; c++) {
            var d = this.slots[c];
            if (d.id) {
                var h = !1,
                    k;
                for (k in a)
                    if (a[k].id == d.id && a[k].data == d.data) {
                        h = !0;
                        break
                    }
                h || a.push({
                    id: d.id,
                    data: d.data
                })
            }
        }
        return a
    };
    this.checkExclude = function(a, c) {
        for (var d in this.excluding)
            if (a == this.excluding[d]) return !0
    };
    this.lastCheck = -999;
    this.sync = function() {
        if (!this.exist) CachedChestInventory[a] &&
            (CachedChestInventory[a] = null);
        else if (!this.synced()) {
            for (var a = this.x + "#" + this.y + "#" + this.z, c = this.getChestSize(), d = 0; d < c; d++) this.syncSlot(d);
            this.lastSync = this.lastCheck = Level.getTime();
            CachedChestInventory[a] = this
        }
    }
}

function getChest(a, c, d) {
    a = new ChestInventory(a, c, d);
    a.sync();
    return a
}

function removeDoubleChestHash(a, c, d) {
    var e = Level.getData(a, c, d),
        f = 1,
        g = 0;
    0 == e % 2 && (f = 0, g = 1);
    54 == getTile(a + f, c, d + g) && Level.getData(a + f, c, d + g) == e && (CachedChestInventory[a + f + "#" + c + "#" + (d + g)] = null);
    54 == getTile(a - f, c, d - g) && Level.getData(a - f, c, d - g) == e && (CachedChestInventory[a - f + "#" + c + "#" + (d - g)] = null)
}

function hasDoubleChest(a, c, d) {
    var e = Level.getData(a, c, d),
        f = 0,
        g = 1;
    if (2 == e || 3 == e) f = 1, g = 0;
    if (54 == getTile(a + f, c, d + g) && Level.getData(a + f, c, d + g) == e || 54 == getTile(a - f, c, d - g) && Level.getData(a - f, c, d - g) == e) return !0
}

function MachineDropper() {
    this.parent = MachineBase;
    this.parent();
    this.id = 57;
    this.updateMachine = function(a) {
        if (0 == Level.getTime() % 20) {
            var c = getChest(a.x, a.y + 1, a.z).getItem(-1, 1);
            c.count && this.addItem(new Coords(a.x, a.y + 3, a.z), c.id, c.count, c.data)
        }
    }
}
ModPE.setItem(460, "skull_zombie", 0, "scrab", 64);
ModPE.setItem(461, "spider_eye_fermented", 0, "scrab box", 64);

function MachineRecycler() {
    this.parent = MachineBase;
    this.parent();
    this.id = 200;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMachineName = function() {
        return "recycler"
    };
    this.getMaxEnergyStored = function() {
        return 300
    };
    this.getContainerId = function() {
        return 0
    };
    this.wrenchClick = function(a) {
        var c = 3 * Math.pow(3, a.overclockers),
            d = "";
        a.progress && (d = ChatColor.GREEN + "progress " + parseInt(a.progress / 4) + "%");
        c > this.getEnergyStored(a) && a.progress && (d = ChatColor.RED + "no energy");
        d && ModPE.showTipMessage(d)
    };
    this.updateMachine =
        function(a) {
            this.showProgress(a);
            2 == a.progress && this.playSound(a, "Machines/RecyclerOp.ogg");
            a.overclockers || (a.overclockers = 0);
            if (0 < a.progress) {
                var c = 1 * Math.pow(3, a.overclockers),
                    d = Math.pow(2, a.overclockers);
                if (this.getEnergyStored(a) < c) return;
                16 > a.progress && (a.energyStored -= c, a.progress += d);
                16 <= a.progress && this.provideRecipe(a) && (a.progress = 0)
            }
            0 == (Level.getTime() + 1551 * a.x + 578 * a.z) % 3 && (a.progress || (a.progress = 0), this.checkHasMaterial(a) ? (1 > a.progress && (a.progress = 1), a.overclockers = 0) : a.progress = 0)
        };
    this.checkHasMaterial = function(a) {
        if (0 < this.getContainer(a).getSlot(0).id) return !0
    };
    this.provideRecipe = function(a) {
        var c = this.getContainer(a);
        a = c.getSlot(0);
        c = c.getSlot(1);
        return 0 != a.id && (460 == c.id || 0 == c.id) && 64 > c.count ? (a.count--, 0 == a.count && (a.id = 0), 1 > 8 * Math.random() && (c.id = 460, c.count++), !0) : !1
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "prs", c.progress)
    };
    this.read = function(a, c) {
        c.progress = DataSaver.ReadNumber(a + "prs")
    };
    this.showProgress = function(a) {
        this.getContainer(a).setProgressBar(a.progress /
            16)
    }
}
var ScrabBoxDropRarity = [];

function AddScrabBoxDrop(a, c, d, e) {
    e || (e = d);
    var f = ScrabBoxDropRarity[ScrabBoxDropRarity.length - 1],
        g = a;
    f && (g = f[3] + a);
    ScrabBoxDropRarity.push([c, d, e, g])
}
AddScrabBoxDrop(.1, 264, 0);
AddScrabBoxDrop(1.8, 15, 0);
AddScrabBoxDrop(2.5, 188, 0);
AddScrabBoxDrop(1.5, 189, 0);
AddScrabBoxDrop(1, 14, 0);
AddScrabBoxDrop(1, 501, 0);
AddScrabBoxDrop(.8, 502, 0);
AddScrabBoxDrop(1.2, 482, 0);
AddScrabBoxDrop(1.2, 483, 0);
AddScrabBoxDrop(3, 331, 0);
AddScrabBoxDrop(.5, 348, 0);
AddScrabBoxDrop(5, 351, 0, 15);
AddScrabBoxDrop(2, 17, 0, 4);
AddScrabBoxDrop(2, 6, 0, 6);
AddScrabBoxDrop(2, 488, 0);
AddScrabBoxDrop(.4, 495, 0);
AddScrabBoxDrop(.07, 493, 0);
AddScrabBoxDrop(2, 263, 0);
AddScrabBoxDrop(3, 260, 0);
AddScrabBoxDrop(2.1, 262, 0);
AddScrabBoxDrop(1, 354, 0);
AddScrabBoxDrop(3, 296, 0);
AddScrabBoxDrop(5, 280, 0);
AddScrabBoxDrop(3.5, 287, 0);
AddScrabBoxDrop(10, 3, 0);
AddScrabBoxDrop(3, 12, 0);
AddScrabBoxDrop(3, 13, 0);
AddScrabBoxDrop(4, 2, 0);

function getRecyclerItem() {
    var a = 100 * Math.random(),
        c = 0,
        d;
    for (d in ScrabBoxDropRarity) {
        var e = ScrabBoxDropRarity[d];
        if (a >= c && a <= e[3]) return a = e[1] + parseInt(Math.random() * (e[2] - e[1])), [e[0], a];
        c = e[3]
    }
    return [460, 0]
}

function getBlockDestroyDrop(a, c) {
    return 1 == a && 0 == c ? [4, 1, 0] : 2 == a ? [3, 1, 0] : 7 < a && 12 > a || 176 == a || 177 == a || 236 == a ? [0, 0, 0] : 13 == a && 10 > Math.random() ? [13, 1, 0] : 16 == a ? [263, 1, 0] : 17 == a ? [17, 1, c % 4] : 18 == a || 20 == a ? [0, 0, 0] : 21 == a ? [351, parseInt(3 * Math.random() + 4), 4] : 26 == a ? [355, 1, 0] : 30 == a ? [287, 1, 0] : 31 == a || 32 == a ? [0, 0, 0] : 43 == a ? [44, 2, c % 8] : 44 == a ? [44, 1, c % 8] : 51 == a || 52 == a ? [0, 0, 0] : 56 == a ? [264, 1, 0] : 59 == a ? [0, 0, 0] : 60 == a ? [3, 1, 0] : 62 == a ? [61, 1, 0] : 63 == a || 68 == a ? [323, 1, 0] : 64 == a ? [0, 0, 0] : 73 == a || 74 == a ? [331, parseInt(3 * Math.random() + 4), 0] : 78 ==
        a || 79 == a ? [0, 0, 0] : 83 == a ? [338, 1, 0] : 89 == a ? [348, 4, 0] : 92 == a || 97 == a || 99 == a || 100 == a || 102 == a ? [0, 0, 0] : 104 == a || 105 == a ? 0 : 110 == a ? [3, 1, 0] : 126 == a ? [0, 0, 0] : 127 == a ? [351, 3, 3] : 129 == a ? [388, 1, 0] : 141 == a || 142 == a || 178 == a || 76 == a ? [0, 0, 0] : 157 == a ? [158, 2, c] : 161 == a ? [0, 0, 0] : 162 == a ? [162, 1, c % 4] : 174 == a ? [0, 0, 0] : 243 == a ? [3, 1, 0] : 244 == a ? [0, 0, 0] : 246 == a ? [49, 1, 0] : [a, 1, c]
}

function isBlockBreakable(a) {
    var c = [0, 7, 8, 9, 10, 11, 95],
        d;
    for (d in c)
        if (a == c[d]) return !1;
    return !0
}

function MachineCropHarvester() {
    this.parent = MachineBase;
    this.parent();
    this.id = 201;
    this.currentChest = null;
    this.getMachineName = function() {
        return "crop harvester"
    };
    this.updateMachine = function(a) {
        a.progress || (a.progress = 0);
        if (0 == Level.getTime() % 5) {
            this.currentChest = getChest(a.x, a.y + 1, a.z);
            var c = a.x - 4 + parseInt(a.progress / 9),
                d = a.z - 4 + parseInt(a.progress % 9);
            a.progress++;
            a.progress %= 81;
            c == a.x && d == a.z ? setTile(c, a.y - 1, d, 9) : this.checkBlock(c, a.y + 0, d)
        }
    };
    this.checkBlock = function(a, c, d) {
        c--;
        for (var e = 0; 3 > e; e++) {
            var f =
                getTile(a, c, d);
            if (60 == f) break;
            if (2 == f || 3 == f) {
                Level.destroyBlock(a, c, d);
                Level.setTile(a, c, d, 60, 1);
                break
            }
            c++;
            if (2 == e) return
        }
        c++;
        this.useBoneMeal(a, c, d);
        this.tryHarvest(a, c, d);
        0 == getTile(a, c, d) && this.tryPlant(a, c, d)
    };
    this.tryHarvest = function(a, c, d) {
        var e = this.currentChest,
            f = getTile(a, c, d),
            g = 7 == Level.getData(a, c, d),
            h = !1;
        17 != f && 161 != f || capitateTree(a, c, d, e);
        86 == f && (e.addItem(86, 1, 0), Level.destroyBlock(a, c, d));
        103 == f && (e.addItem(360, 5 * Math.random() + 3, 0), Level.destroyBlock(a, c, d));
        g && (59 == f && (e.addItem(295,
            3 * Math.random() + 1, 0), e.addItem(296, 1, 0), h = !0), 141 == f && (e.addItem(391, 3 * Math.random() + 1, 0), h = !0), 142 == f && (e.addItem(391, 3 * Math.random() + 1, 0), h = !0), 244 == f && (e.addItem(458, 3 * Math.random(), 0), e.addItem(457, 1 + 2 * Math.random(), 0), h = !0), h && Level.destroyBlock(a, c, d))
    };
    this.tryPlant = function(a, c, d) {
        var e = this.currentChest,
            f = [
                [295, 59],
                [391, 141],
                [392, 142],
                [458, 244],
                [361, 104],
                [362, 105]
            ],
            g;
        for (g in f) {
            var h = f[g][0],
                k = f[g][1],
                h = e.getItem(h, 1, 0);
            if (h.count) {
                setTile(a, c, d, k);
                return
            }
        }
        for (f = 0; 6 > f; f++)
            if (k = h = 6, h = e.getItem(h,
                    1, f), h.count) {
                setTile(a, c, d, k, f);
                break
            }
    };
    this.useBoneMeal = function(a, c, d) {
        var e = getTile(a, c, d),
            f = Level.getData(a, c, d);
        59 != e && 104 != e && 105 != e && 141 != e && 142 != e && 244 != e || 0 == this.currentChest.getItem(351, 1, 15).count || (f += 3 + 3 * Math.random(), 7 < f && (f = 7), setTile(a, c, d, e, f), animateSmoke(ParticleType.cloud, a, c, d))
    }
}

function MachineQuarry() {
    this.parent = MachineBase;
    this.parent();
    this.id = 202;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 500
    };
    this.getMachineName = function() {
        return "quarry"
    };
    this.updateMachine = function(a) {
        a.fuel || (a.fuel = 0);
        1 > a.fuel && (a.fuel += this.convertEnergyToFuel(a, 80));
        a.progress || (a.progress = 0);
        if (0 == Level.getTime() % 9 || a.noDelay) {
            var c = getChest(a.x, a.y + 1, a.z);
            c.exist && 0 < a.fuel && (a.fuel--, this.digNextBlock(a, c) && (a.noDelay = !0, a.fuel++))
        }
    };
    this.digNextBlock =
        function(a, c) {
            var d = a.progress % 289,
                e = a.x - 8 + parseInt(d / 17),
                d = a.z - 8 + parseInt(d % 17),
                f = a.y - 2 - parseInt(a.progress / 17 / 17),
                g = getBlockDestroyDrop(getTile(e, f, d), Level.getData(e, f, d));
            (!a.noDelay || .1 > Math.random()) && this.makeRedstoneRay(new Coords(a.x + .5, a.y + .5, a.z + .5), e + .5, f + .5, d + .5);
            a.noDelay = !1;
            if (7 != g[0]) {
                if (g[0] && 8 != g[0] && 9 != g[0] && 10 != g[0] && 11 != g[0]) {
                    if (c.addItem(g[0], g[1], g[2]) == g[1]) return;
                    setTile(e, f, d, 0)
                }
                a.progress++;
                return 0 == g[0] ? !0 : !1
            }
        };
    this.getDropId = function(a, c, d) {
        a = getTile(a, c, d);
        return 1 ==
            a ? [4, 1, 0] : 16 == a ? [263, 1, 0] : 21 == a ? [351, parseInt(3 * Math.random() + 4), 4] : 73 == a || 74 == a ? [331, parseInt(2 * Math.random() + 4), 0] : 56 == a ? [264, 1, 0] : 129 == a ? [388, 1, 0] : 2 == a ? [3, 1, 0] : 18 == a || 31 == a || 32 == a ? [0, 0, 0] : [a, 1, 0]
    };
    this.checkLoaded = function(a, c) {
        return 0 != getTile(a, 0, c)
    };
    this.makeRedstoneRay = function(a, c, d, e) {
        c -= a.x;
        d -= a.y;
        e -= a.z;
        var f = Math.sqrt(c * c + d * d + e * e);
        c /= f;
        d /= f;
        e /= f;
        for (var g = 0, h = 0; h < f && !(Level.addParticle(ParticleType.redstone, a.x + c * h, a.y + d * h, a.z + e * h, 0, 0, 0, 1), g++, 75 < g); h += .75 + .5 * Math.random());
    };
    this.save =
        function(a, c) {
            DataSaver.Save(a + "fuel", c.fuel);
            DataSaver.Save(a + "pr", c.progress)
        };
    this.read = function(a, c) {
        c.fuel = DataSaver.ReadNumber(a + "fuel");
        c.progress = Math.max(DataSaver.ReadNumber(a + "pr") - 10, 0)
    }
}

function MachineReceiver() {
    this.parent = MachineBase;
    this.parent();
    this.id = 217;
    this.getMachineName = function() {
        return "chest transporter's receiver"
    };
    this.getContainerId = function() {
        return 5
    };
    this.updateMachine = function(a) {
        this.getContainer(a)
    };
    this.canDeactivate = function() {
        return !1
    }
}

function MachineChestTransporter() {
    this.parent = MachineBase;
    this.parent();
    this.id = 203;
    this.getMachineName = function() {
        return "chest transporter"
    };
    this.updateMachine = function(a) {
        if (0 == Level.getTime() % 20) {
            var c = Level.getTime() / 20;
            a.pipeConnections && a.pipeUpdated_ || (RebuildPipeConnections(a), a.pipeUpdated_ = !0, a.receiverUpdated_ = !1);
            a.rData && a.receiverUpdated_ || (this.rebuildReceiverData(a), a.receiverUpdated_ = !0);
            c = this.getReceiverSortList(a.receivers[c % a.receivers.length]);
            this.transFromContainer(a, c)
        }
    };
    this.makeRedstoneRay = function(a, c, d, e) {
        c -= a.x;
        d -= a.y;
        e -= a.z;
        var f = Math.sqrt(c * c + d * d + e * e);
        c /= f;
        d /= f;
        e /= f;
        for (var g = 0; g < f; g += .1) Level.addParticle(ParticleType.redstone, a.x + c * g, a.y + d * g, a.z + e * g, 0, 0, 0, 1)
    };
    this.save = function(a, c) {};
    this.read = function(a, c) {};
    this.recive = function(a, c, d, e, f, g) {
        a = [
            [a + 1, c, d],
            [a - 1, c, d],
            [a, c + 1, d],
            [a, c - 1, d],
            [a, c, d + 1],
            [a, c, d - 1]
        ];
        for (var h in a)
            if (0 == f) return 0;
        return f
    };
    this.transportToAllReceivers = function(a, c, d, e) {
        for (var f in a.rData) {
            if (1 > d) break;
            this.canReceiveItem(a.rData[f].ct_receiver,
                c, e) && (d = this.putItemToSpot(a.rData[f], c, d, e))
        }
        return d
    };
    this.ContainerPutSlots = {
        0: [0],
        1: [0],
        2: [0],
        3: [0],
        4: [2, 3, 4, 5, 6, 7, 8],
        5: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        6: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    };
    this.ContainerGetSlots = {
        0: [1],
        1: [0],
        2: [1],
        3: [0],
        4: [2, 3, 4, 5, 6, 7, 8],
        5: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        6: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    };
    this.putItemToSpot = function(a, c, d, e) {
        if (a.isChestCoords) {
            if (a = getChest(a.x, a.y, a.z), a.exist) return a.addItem(c,
                d, e)
        } else return this.transportToContainer(a, c, d, e);
        return d
    };
    this.transportToContainer = function(a, c, d, e) {
        var f = getMachineType(a);
        if (!f || 217 == f.id) return d;
        var g = f.getContainer(a);
        if (!g) return d;
        var h = 999;
        6 == f.getContainer(a).id && (h = 4 + 4 * f.getGUIMetadata(a));
        for (var k in this.ContainerPutSlots[g.id]) {
            if (k >= h) break;
            d = g.putToSlot(this.ContainerPutSlots[g.id][k], c, d, e);
            if (1 > d) break
        }
        return d
    };
    this.getContainerOutSlot = function(a, c) {
        var d = getMachineType(a);
        if (!d) return null;
        d = d.getContainer(a);
        if (!d) return null;
        for (var e in this.ContainerGetSlots[d.id]) {
            var f = d.getSlot(this.ContainerGetSlots[d.id][e]),
                g = 0 == c.length;
            for (e in c)
                if (c[e].id == f.id && c[e].data == f.data) {
                    g = !0;
                    break
                }
            if (f.id && f.count && g) return f
        }
        return null
    };
    this.transportToAllDst = function(a, c, d, e) {
        for (var f in a.pipeConnections) {
            var g = a.pipeConnections[f];
            g.dst && 0 < d && (g.dst.x != a.x || g.dst.y != a.y - 1 || g.dst.z != a.z) && (d = this.recive(g.dst.x, g.dst.y, g.dst.z, c, d, e))
        }
        return d
    };
    this.transFromContainer = function(a, c) {
        var d = getTile(a.x, a.y - 1, a.z);
        if (54 == d) {
            var e =
                getChest(a.x, a.y - 1, a.z);
            if (0 < c.length) {
                var f, g;
                for (g in c)
                    if (f = e.getItem(c[g].id, 64, c[g].data), f.count) break
            } else
                for (g in e.slots)
                    if (e.slots[g].id) {
                        f = e.slots[g];
                        e.setSlot(g, 0, 0, 0);
                        break
                    }
            f && (g = this.transportToAllReceivers(a, f.id, f.count, f.data), e.addItem(f.id, g, f.data))
        }
        isMachine(d) && 217 != d && (d = getMachine(a.x, a.y - 1, a.z)) && (d = this.getContainerOutSlot(d, c)) && (d.count += this.transportToAllReceivers(a, d.id, 1, d.data) - 1, 1 > d.count && (d.id = 0))
    };
    this.rebuildReceiverData = function(a) {
        a.rData = [];
        a.receivers = [];
        for (var c in a.pipeConnections) {
            var d = a.pipeConnections[c];
            if (!d || !d.dst) break;
            var e = d.dst.x,
                f = d.dst.y,
                g = d.dst.z;
            (d = getMachine(e, f, g)) && a.receivers.push(d);
            var e = [
                    [e + 1, f, g],
                    [e - 1, f, g],
                    [e, f + 1, g],
                    [e, f - 1, g],
                    [e, f, g + 1],
                    [e, f, g - 1]
                ],
                h;
            for (h in e) {
                var f = e[h][0],
                    g = e[h][1],
                    k = e[h][2],
                    l = getTile(f, g, k);
                54 == l ? a.rData.push({
                    x: f,
                    y: g,
                    z: k,
                    isChestCoords: !0,
                    ct_receiver: d
                }) : isMachine(l) && (f = getMachine(f, g, k)) && (f.ct_receiver = d, f && a.rData.push(f))
            }
        }
    };
    this.canReceiveItem = function(a, c, d) {
        if (!a) return !0;
        d = !1;
        for (var e = 0; 9 >
            e; e++) {
            var f = a.container.getSlot(e);
            if (0 < f.id && (d = !0, f.id == c)) return !0
        }
        return !d
    };
    this.getReceiverSortList = function(a) {
        if (!a) return [];
        for (var c = [], d = 0; 9 > d; d++) {
            var e = a.container.getSlot(d);
            0 < e.id && c.push(e)
        }
        return c
    }
}

function connectChestTransporter(a, c, d, e) {
    a.connect = new Coords(c, d, e)
}

function MachineMacerator() {
    this.parent = MachineBase;
    this.parent();
    this.id = 204;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMachineName = function() {
        return "macerator"
    };
    this.getMaxEnergyStored = function() {
        return 2E3
    };
    this.getContainerId = function() {
        return 2
    };
    this.wrenchClick = function(a) {
        var c = 3 * Math.pow(3, a.overclockers),
            d = "";
        a.progress && (d = ChatColor.GREEN + "progress " + parseInt(a.progress / 4) + "%");
        c > this.getEnergyStored(a) && a.progress && (d = ChatColor.RED + "no energy");
        d && ModPE.showTipMessage(d)
    };
    this.updateMachine =
        function(a) {
            this.showProgress(a);
            2 == a.progress && this.playSound(a, "Machines/MaceratorOp.ogg");
            a.overclockers || (a.overclockers = 0);
            if (0 < a.progress) {
                var c = 3 * Math.pow(3, a.overclockers),
                    d = Math.pow(2, a.overclockers);
                if (this.getEnergyStored(a) < c) return;
                400 > a.progress && (a.energyStored -= c, a.progress += d);
                400 <= a.progress && this.provideRecipe(a) && (a.progress = 0)
            }
            0 == (Level.getTime() + 1551 * a.x + 578 * a.z) % 40 && (a.progress || (a.progress = 0), this.checkHasMaterial(a) ? (1 > a.progress && (a.progress = 1), a.overclockers = this.getUpgrades(a)) :
                (0 < a.progress && this.playSound(a, "Machines/InterruptOne.ogg"), a.progress = 0))
        };
    this.checkHasMaterial = function(a) {
        a = this.getContainer(a).getSlot(0).id;
        if (15 == a || 14 == a || 265 == a || 266 == a || 188 == a || 189 == a || 480 == a || 481 == a || 484 == a || 263 == a) return !0
    };
    this.provideRecipe = function(a) {
        var c = this.getContainer(a);
        a = [
            [14, 502, 2],
            [15, 501, 2],
            [265, 501, 1],
            [266, 502, 1],
            [188, 482, 2],
            [189, 483, 2],
            [480, 482, 1],
            [481, 483, 1],
            [484, 501, 1],
            [263, 447, 1]
        ];
        var d = c.getSlot(0),
            c = c.getSlot(1),
            e;
        for (e in a) {
            var f = a[e][1],
                g = a[e][2];
            if (d.id == a[e][0] &&
                (c.id == f || 0 == c.id) && 64 >= c.count + g) return c.id = f, c.count += g, d.count--, d.count || (d.id = 0), !0
        }
        return !1
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "prs", c.progress)
    };
    this.read = function(a, c) {
        c.progress = DataSaver.ReadNumber(a + "prs")
    };
    this.getUpgrades = function(a) {
        a = this.getContainer(a).getSlot(2);
        return 506 == a.id ? a.count : 0
    };
    this.showProgress = function(a) {
        this.getContainer(a).setProgressBar(a.progress / 400)
    }
}

function MachineElectricFurnace() {
    this.parent = MachineBase;
    this.parent();
    this.id = 213;
    this.recipes = [
        [14, 266, 1],
        [15, 265, 1],
        [501, 265, 1],
        [502, 266, 1],
        [17, 263, 1],
        [319, 320, 1],
        [363, 364, 1],
        [365, 366, 1],
        [392, 393, 1],
        [87, 405, 1],
        [4, 1, 1],
        [485, 488, 1],
        [12, 20, 1],
        [482, 480, 1],
        [483, 481, 1],
        [188, 480, 1],
        [189, 481, 1],
        [265, 484, 1]
    ];
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMachineName = function() {
        return "electric furnace"
    };
    this.getMaxEnergyStored = function() {
        return 2E3
    };
    this.getContainerId = function() {
        return 2
    };
    this.wrenchClick =
        function(a) {
            var c = 3 * Math.pow(3, a.overclockers),
                d = "";
            a.progress && (d = ChatColor.GREEN + "progress " + parseInt(a.progress / 4) + "%");
            c > this.getEnergyStored(a) && a.progress && (d = ChatColor.RED + "no energy");
            d && ModPE.showTipMessage(d)
        };
    this.updateMachine = function(a) {
        this.showProgress(a);
        2 == a.progress && this.playSound(a, "Machines/ElectricFurnace.ogg");
        a.overclockers || (a.overclockers = 0);
        if (0 < a.progress) {
            var c = 3 * Math.pow(3, a.overclockers),
                d = Math.pow(2, a.overclockers);
            if (this.getEnergyStored(a) < c) return;
            100 > a.progress &&
                (a.energyStored -= c, a.progress += d);
            100 <= a.progress && this.provideRecipe(a) && (a.progress = 0)
        }
        0 == (Level.getTime() + 1551 * a.x + 578 * a.z) % 40 && (a.progress || (a.progress = 0), this.checkHasMaterial(a) ? (1 > a.progress && (a.progress = 1), a.overclockers = this.getUpgrades(a)) : (0 < a.progress && this.playSound(a, "Machines/InterruptOne.ogg"), a.progress = 0))
    };
    this.checkHasMaterial = function(a) {
        a = this.getContainer(a).getSlot(0).id;
        for (var c in this.recipes)
            if (this.recipes[c][0] == a) return !0
    };
    this.provideRecipe = function(a) {
        var c = this.getContainer(a);
        a = this.recipes;
        var d = c.getSlot(0),
            c = c.getSlot(1),
            e;
        for (e in a) {
            var f = a[e][1],
                g = a[e][2];
            if (d.id == a[e][0] && (c.id == f || 0 == c.id) && 64 >= c.count + g) return c.id = f, c.count += g, d.count--, d.count || (d.id = 0), !0
        }
        return !1
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "prs", c.progress)
    };
    this.read = function(a, c) {
        c.progress = DataSaver.ReadNumber(a + "prs")
    };
    this.getUpgrades = function(a) {
        a = this.getContainer(a).getSlot(2);
        return 506 == a.id ? a.count : 0
    };
    this.showProgress = function(a) {
        this.getContainer(a).setProgressBar(a.progress / 100)
    }
}

function MachineBeacon() {
    this.parent = MachineBase;
    this.parent();
    this.id = 205;
    this.particleTypes = [{
        id: ParticleType.flame,
        name: "flame"
    }, {
        id: ParticleType.crit,
        name: "crit"
    }, {
        id: ParticleType.redstone,
        name: "redstone"
    }, {
        id: ParticleType.heart,
        name: "hearts"
    }, {
        id: ParticleType.lava,
        name: "lava fx"
    }];
    this.getInfo = function(a) {
        return "particles - " + this.particleTypes[a.parType.name]
    };
    this.updateMachine = function(a) {
        a.parType || (a.parType = 0);
        var c = (Level.getTime() + 528894 * Math.abs(a.x) + 42728 * Math.abs(a.z)) % 60 / 59,
            d = new Coords(a.x +
                .4 * Math.random() + .3, a.y + 30 * c, a.z + .4 * Math.random() + .2);
        a = this.particleTypes[a.parType].id;
        this.makeSingler(a, d.x, d.y, d.z);
        1 == c && this.explode(a, d.x, d.y, d.z)
    };
    this.getMachineName = function() {
        return "beacon"
    };
    this.makeSingler = function(a, c, d, e) {
        for (var f = 0; 5 > f; f++) Level.addParticle(a, c - .2 + .4 * Math.random(), d - .2 + .4 * Math.random(), e - .2 + .4 * Math.random(), 0, 0, 0, 1);
        this.explode = function(a, c, d, e) {
            for (var f = 0; 250 > f; f++) {
                var n = 7.5 * Math.random(),
                    r = 6.3 * Math.random(),
                    p = 3.2 * Math.random() - 1.6,
                    q = c + Math.sin(r) * Math.cos(p) *
                    n,
                    r = e + Math.cos(r) * Math.cos(p) * n,
                    p = d + Math.sin(p) * n;
                Level.addParticle(a, q, p, r, (q - c) / n / 2, (p - d) / n / 2, (r - e) / n / 2, 1)
            }
        }
    };
    this.wrenchClick = function(a) {
        a.parType || (a.parType = 0);
        a.parType++;
        a.parType %= this.particleTypes.length;
        clientMessage("switched beacon to " + this.particleTypes[a.parType].name + " mode")
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "#fx", c.parType)
    };
    this.read = function(a, c) {
        c.parType = DataSaver.ReadNumber(a + "#fx")
    }
}

function MachineDrill() {
    this.parent = MachineBase;
    this.parent();
    this.id = 207;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 500
    };
    this.getMachineName = function() {
        return "drill"
    };
    this.updateMachine = function(a) {
        a.progress || (a.progress = 0);
        a.fuel || (a.fuel = 0);
        1 > a.fuel && 120 <= this.getEnergyStored(a) && (a.energyStored -= 120, a.fuel++);
        if (0 == Level.getTime() % 33 || a.noDelay) {
            var c = getChest(a.x, a.y + 1, a.z);
            1 > a.fuel && c.getItem(263, 1, 0).count && (a.fuel = 16);
            if (1 > a.fuel) return a.noDelay = !1;
            var d = a.y - 1 - a.progress,
                c = this.dig(a.x, d, a.z, c);
            if (0 == c || 1 == c) 1 == c && (a.noDelay = !0), a.progress++, a.fuel--, this.makeRedstoneRay(new Coords(a.x + .5, a.y + .5, a.z + .5), a.x + .5, d - .5, a.z + .5)
        }
    };
    this.dig = function(a, c, d, e, f) {
        var g = getTile(a, c, d),
            h = Level.getData(a, c, d);
        if (!this.isOre(g) && f) return 2;
        if (0 == g || 8 == g || 9 == g || 10 == g || 11 == g) return 1;
        if (7 == g) return 2;
        h = getBlockDestroyDrop(g, h);
        if (0 < e.addItem(h[0], h[1], h[2])) return 2;
        Level.destroyBlock(a, c, d);
        if (this.isOre(g) || !f) this.dig(a + 1, c, d, e, 1), this.dig(a - 1, c, d, e, 1),
            this.dig(a, c + 1, d, e, 1), this.dig(a, c - 1, d, e, 1), this.dig(a, c, d + 1, e, 1), this.dig(a, c, d - 1, e, 1);
        return 0
    };
    this.isOre = function(a) {
        return 16 == a || 21 == a || 14 == a || 15 == a || 56 == a || 129 == a || 73 == a || 74 == a || 195 == a || 196 == a || 197 == a
    };
    this.getDropId = function(a) {
        return 1 == a ? [4, 1, 0] : 16 == a ? [263, 1, 0] : 21 == a ? [351, parseInt(3 * Math.random() + 4), 4] : 73 == a || 74 == a ? [331, parseInt(2 * Math.random() + 4), 0] : 56 == a ? [264, 1, 0] : 129 == a ? [388, 1, 0] : 2 == a ? [3, 1, 0] : 18 == a || 31 == a || 32 == a ? [0, 0, 0] : [a, 1, 0]
    };
    this.checkLoaded = function(a, c) {
        return 0 != getTile(a, 0, c)
    };
    this.makeRedstoneRay = function(a, c, d, e) {
        c -= a.x;
        d -= a.y;
        e -= a.z;
        var f = Math.sqrt(c * c + d * d + e * e);
        c /= f;
        d /= f;
        e /= f;
        for (var g = 0; g < f; g += 1) Level.addParticle(ParticleType.redstone, a.x + c * g, a.y + d * g, a.z + e * g, 0, 0, 0, 1)
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "fuel", c.fuel);
        DataSaver.Save(a + "pr", c.progress)
    };
    this.read = function(a, c) {
        c.fuel = DataSaver.ReadNumber(a + "fuel");
        c.progress = DataSaver.ReadNumber(a + "pr")
    }
}

function MachineMassFabricator() {
    this.parent = MachineBase;
    this.parent();
    this.id = 214;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMachineName = function() {
        return "mass fabricator"
    };
    this.getMaxEnergyStored = function() {
        return 1E3
    };
    this.getContainerId = function() {
        return 3
    };
    this.updateMachine = function(a) {
        a.massProgress || (a.massProgress = 0);
        if (!a.ctls || 0 > a.ctls) a.ctls = 0;
        this.getEnergyStored(a);
        var c = Level.getTime();
        0 == c % 15 && a.needSound && (this.playSound(a, "Generators/MassFabricator/MassFabScrapSolo.ogg"), a.needSound = !1);
        1E5 > a.massProgress && (0 == a.ctls ? a.massProgress += a.energyStored : (a.massProgress += 4 * a.energyStored, a.ctls -= a.energyStored / 250), 0 < a.energyStored && (a.needSound = !0), a.energyStored = 0);
        0 == c % 20 && (c = this.getContainer(a), c.setLiquidBar(a.massProgress / 1E5, 7), c = c.getSlot(0), 460 == c.id && 0 == a.ctls && (a.ctls = 4, c.count--, 0 == c.count && (c.id = 0)), 461 == c.id && 0 == a.ctls && (a.ctls = 36, c.count--, 0 == c.count && (c.id = 0)), 1E5 <= a.massProgress && (c = getMachine(a.x, a.y + 1, a.z)) && (7 == c.liquid || 0 == c.liquid) && 15 >= c.volume && (c.liquid = 7,
            c.volume++, a.massProgress = 0))
    };
    this.wrenchClick = function(a) {
        clientMessage("uu-matter progress: " + Math.floor(a.massProgress / 100) / 10 + "%")
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "mass", c.massProgress);
        DataSaver.Save(a + "ctls", c.ctls)
    };
    this.getInfo = function(a) {
        return "progress " + Math.floor(a.massProgress / 100) / 10 + "%"
    };
    this.read = function(a, c) {
        c.massProgress = DataSaver.ReadNumber(a + "mass");
        c.ctls = DataSaver.ReadNumber(a + "ctls")
    }
}

function MachineGenSolar() {
    this.parent = MachineBase;
    this.parent();
    this.id = 209;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMachineName = function() {
        return "solar panel"
    };
    this.getMaxEnergyStored = function() {
        return 1
    };
    this.isGenerator = function() {
        return !0
    };
    this.getEnergyOutput = function(a) {
        return 0 < Level.getTime() % 20 ? 0 : 15 == Level.getBrightness(a.x, a.y + 1, a.z) ? 20 : 0
    }
}

function MachineFuelGen() {
    this.parent = MachineBase;
    this.parent();
    this.id = 211;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMachineName = function() {
        return "fuel generator"
    };
    this.getMaxEnergyStored = function() {
        return 1E4
    };
    this.isGenerator = function() {
        return !0
    };
    this.getContainerId = function() {
        return 1
    };
    this.getEnergyOutput = function(a) {
        if (0 == Level.getTime() % 4) {
            var c = this.getEnergyStored(a);
            if (256 < c) return a.energyStored -= 256, 256;
            a.energyStored -= c;
            return c
        }
    };
    this.updateMachine = function(a) {
        this.getEnergyStored(a);
        a.fuel || (a.fuel = 0);
        if (!a.maxFuel || a.maxFuel < a.fuel) a.maxFuel = a.fuel;
        1 > a.maxFuel && (a.maxFuel = 1);
        if (1 > a.fuel && a.energyStored < this.getMaxEnergyStored() && 0 == Level.getTime() % 20) {
            a.maxFuel = 1;
            var c = this.getContainer(a).getSlot(0),
                d = [
                    [263, 400],
                    [5, 75],
                    [280, 25],
                    [6, 25],
                    [17, 75],
                    [325, 1E3]
                ],
                e;
            for (e in d) d[e][0] == c.id && (c.count--, a.fuel += d[e][1], 0 == c.count && (c.id = 0));
            this.getContainer(a).setFireBar(0)
        }
        1 < a.fuel && 0 == Level.getTime() % 40 && this.playSound(a, "Generators/GeneratorLoop.ogg");
        0 < a.fuel ? (a.energyStored < this.getMaxEnergyStored() &&
            (a.energyStored = Math.min(a.energyStored + 10, this.getMaxEnergyStored()), a.fuel--), 0 < a.maxFuel && this.getContainer(a).setFireBar(a.fuel / a.maxFuel)) : this.getContainer(a).setFireBar(0)
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "fuel", c.fuel)
    };
    this.read = function(a, c) {
        c.fuel = DataSaver.ReadNumber(a + "fuel")
    }
}

function CreateBarrelRender(a) {
    var c = Renderer.createHumanoidRenderer();
    model = c.getModel();
    model.getPart("head").clear();
    model.getPart("body").clear();
    model.getPart("rightArm").clear();
    model.getPart("leftArm").clear();
    model.getPart("rightLeg").clear();
    model.getPart("leftLeg").clear();
    b = model.getPart("body");
    b.addBox(-7, 24.5 - a, -7, 14, a, 14);
    return c
}
for (var barrelRenders = [], i = 0; 16 >= i; i++) barrelRenders[i] = CreateBarrelRender(i);
ModPE.setFoodItem(473, "potion_bottle_empty", 0, 5, "honey bottle", 1);
ModPE.setFoodItem(474, "potion_bottle_drinkable", 0, 8, "mead bottle", 1);
ModPE.setItem(475, "potion_bottle_splash", 0, "empty bottle", 1);
var LIQUID_NONE = 0,
    LIQUID_WATER = 8,
    LIQUID_LAVA = 10,
    LIQUID_MILK = 1,
    LIQUID_HONEY = 2,
    LIQUID_MEAD = 3;

function MachineBarrel() {
    this.parent = MachineBase;
    this.parent();
    this.id = 208;
    this.liquidNames = {
        LIQUID_NONE: "none",
        LIQUID_WATER: "water",
        LIQUID_LAVA: "lava",
        LIQUID_MILK: "milk",
        LIQUID_HONEY: "honey",
        LIQUID_MEAD: "mead",
        4: "oil"
    };
    this.brewingRecipes = {
        2: {
            res: 3,
            time: 1E3
        }
    };
    this.getMachineName = function() {
        return "barrel"
    };
    this.getContainerId = function() {
        return 3
    };
    this.getLiquidName = function(a) {
        if (0 == a) return "none";
        if (1 == a) return "milk";
        if (8 == a) return "water";
        if (10 == a) return "lava";
        if (2 == a) return "honey";
        if (3 == a) return "mead";
        if (4 == a) return "oil";
        if (5 == a) return "fuel";
        if (6 == a) return "biomass";
        if (7 == a) return "matter"
    };
    this.canDeactivate = function() {
        return !1
    };
    this.getInfo = function(a) {
        return a.liquid ? a.volume + "/" + a.maxVolume + " buckets of " + this.getLiquidName(a.liquid) : "empty"
    };
    this.updateBrewing = function(a) {
        a.brewing || (a.brewing = 0);
        var c = this.brewingRecipes[a.liquid];
        c ? (.8 > Math.random() && a.brewing++, a.brewing > c.time && (a.liquid = c.res, a.brewing = 0)) : a.brewing = 0
    };
    this.updateMachine = function(a) {
        a.maxVolume = 16;
        if (!a.liquid || 0 > a.liquid) a.liquid =
            LIQUID_NONE, a.volume = 0;
        if (!a.volume || 0 > a.volume) a.volume = 0, a.liquid = LIQUID_NONE;
        a.srcBarrel ? a.srcBarrel.removed && (a.srcBarrel = a) : a.srcBarrel = a;
        Entity.remove(a.ent);
        if (Options_FancyGrap && 0 < a.liquid) {
            a.ent = Level.spawnMob(a.x + .5, a.y, a.z + .5, 11);
            Entity.setCollisionSize(a.ent, 0, 0);
            try {
                Entity.setRenderType(a.ent, barrelRenders[parseInt(a.volume)].renderType)
            } catch (c) {}
            Entity.setMobSkin(a.ent, "mob/liquid/" + a.liquid + ".png");
            BindEntityToPosition(a.ent, a.x + .5, a.y, a.z + .5)
        }
        this.getContainer(a).setLiquidBar(a.volume /
            16, a.liquid);
        0 == Level.getTime() % 20 && this.updateBrewing(a);
        0 == Level.getTime() % 2 && (a.maxVolume = a.srcBarrel.maxVolume);
        if (0 == Level.getTime() % 20 && 15 >= a.volume) {
            var d = this.getContainer(a).getSlot(0);
            325 != d.id || d.data != a.liquid && 0 != a.liquid || (a.liquid = d.data, d.data = 0, a.volume++);
            473 != d.id || 0 != a.liquid && 2 != a.liquid || (a.volume++, a.liquid = 2, d.id = 475);
            474 != d.id || 0 != a.liquid && 3 != a.liquid || (a.volume++, a.liquid = 3, d.id = 475);
            464 != d.id || 0 != a.liquid && 4 != a.liquid || (a.volume++, a.liquid = 4, d.id = 325);
            465 != d.id || 0 != a.liquid &&
                7 != a.liquid || (a.volume++, a.liquid = 7, d.id = 325);
            466 != d.id || 0 != a.liquid && 6 != a.liquid || (a.volume++, a.liquid = 6, d.id = 325);
            467 != d.id || 0 != a.liquid && 5 != a.liquid || (a.volume++, a.liquid = 5, d.id = 325)
        }
        if (0 == Level.getTime() % 10 && 208 == getTile(a.x, a.y - 1, a.z) && (d = getMachine(a.x, a.y - 1, a.z)) && 16 > d.volume && (d.liquid == a.liquid || 0 == d.liquid)) {
            var e;
            e = Math.min(1, 16 - d.volume);
            e = Math.min(e, a.volume);
            d.volume += e;
            a.volume -= e;
            d.liquid = a.liquid
        }
    };
    this.initSrcBarrel_ = function(a) {
        a.maxVolume = 8;
        var c = getMachine(a.x, a.y - 1, a.z);
        if (c) {
            var d =
                getMachineType(c);
            d && d.id == this.id ? c.liquid != a.liquid && c.liquid ? a.srcBarrel = a : (c.srcBarrel || this.initSrcBarrel(c), a.srcBarrel = c.srcBarrel) : a.srcBarrel = a
        } else a.srcBarrel = a
    };
    this.initSrcBarrel = function(a) {
        this.initSrcBarrel_(a);
        this.checkMaxVolume(a)
    };
    this.checkMaxVolume = function(a) {
        var c = getMachine(a.x, a.y + 1, a.z),
            d = c ? getMachineType(c) : null;
        a.srcBarrel.maxVolume = c && d && d.id == this.id ? Math.max(a.srcBarrel.maxVolume, 8 * (a.y - a.srcBarrel.y + 1)) : 8 * (a.y - a.srcBarrel.y + 1)
    };
    this.animateLiquid = function(a) {
        var c =
            a.liquid,
            d = 9,
            e = -1;
        if (c) {
            1 == c && (c = 42);
            8 == c && (c = 27);
            10 == c && (c = 19);
            if (2 == c || 3 == c) c = 2;
            19 == c && (c = 1, d = ParticleType.flame, e = -.03);
            var f = Math.random(),
                g = Math.random();.5 > Math.random() ? f = Math.floor(f + .5) : g = Math.floor(g + .5);
            0 == f && (f = -.05);
            0 == g && (g = -.05);
            1 == f && (f = 1.05);
            1 == g && (g = 1.05);
            Level.addParticle(d, a.x + f, Math.random() + a.y, a.z + g, 0, e, 0, c)
        }
    };
    this.wrenchClick = function(a) {
        clientMessage(this.getInfo(a));
        var c = this.brewingRecipes[a.liquid];
        c && ModPE.showTipMessage(ChatColor.YELLOW + "brewing " + this.getLiquidName(c.res) +
            " " + parseInt(a.brewing / c.time * 1E3) / 10 + "%")
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "liquid", c.liquid);
        DataSaver.Save(a + "vol", c.volume);
        DataSaver.Save(a + "brew", c.brewing)
    };
    this.read = function(a, c) {
        c.liquid = DataSaver.ReadNumber(a + "liquid");
        c.volume = DataSaver.ReadFloat(a + "vol");
        c.brewing = DataSaver.ReadFloat(a + "brew")
    };
    this.onDestroy = function(a) {
        Entity.remove(a.ent)
    }
}

function getLiquidTypeAtCoords(a, c, d) {
    var e = getTile(a, c, d);
    return Level.getData(a, c, d) ? 0 : 8 == e || 9 == e ? 8 : 10 == e || 11 == e ? 10 : 208 == e && (a = getMachine(a, c, d)) ? a.liquid : 176 == e ? 4 : 0
}

function pullBucketOfLiquid(a, c, d) {
    var e = getTile(a, c, d);
    return 0 < Level.getData(a, c, d) ? 0 : 8 == e || 9 == e ? (setTile(a, c, d, 0), 8) : 176 == e ? (setTile(a, c, d, 0), 4) : 10 == e || 11 == e ? (setTile(a, c, d, 0), 10) : 208 == e && (a = getMachine(a, c, d)) ? (a.volume--, a.liquid) : 0
}

function barrel_getBucket(a) {
    if (!a) return LIQUID_NONE;
    if (!a.liquid || 0 > a.volume) return 0;
    a.volume--;
    return a.liquid
}

function barrel_addBucket(a, c) {
    if (!a || a.volume > a.maxVolume - 1 || c != a.liquid && a.liquid) return !1;
    a.volume++;
    a.liquid = c;
    return !0
}

function isBucketLiquid(a) {
    return 1 == a || 8 == a || 10 == a || 4 == a || 5 == a || 6 == a || 7 == a
}

function barrel_itemTap(a, c, d) {
    a && (325 == c && barrel_bucketTap(a, d), 473 != c && 474 != c && 475 != c || barrel_bottleTap(a, c, d))
}

function barrel_bottleTap(a, c, d) {
    if (475 == c) {
        d = 1;
        if (!a.liquid) {
            clientMessage("no liquid here");
            return
        }
        if (2 != a.liquid && 3 != a.liquid) {
            clientMessage("cant put this in a bottle");
            return
        }
        2 == a.liquid && (d = 473);
        3 == a.liquid && (d = 474);
        Entity.setCarriedItem(getPlayerEnt(), d, 1, 0);
        a.volume--
    }
    if (473 == c) {
        if (15 < a.volume) {
            clientMessage("barrel is full");
            return
        }
        2 == a.liquid || 0 == a.liquid ? (Entity.setCarriedItem(getPlayerEnt(), 475, 1, 0), a.liquid = 2, a.volume++) : clientMessage("here is another liquid")
    }
    474 == c && (15 < a.volume ? clientMessage("barrel is full") :
        3 == a.liquid || 0 == a.liquid ? (Entity.setCarriedItem(getPlayerEnt(), 475, 1, 0), a.liquid = 3, a.volume++) : clientMessage("here is another liquid"))
}

function barrel_bucketTap(a, c) {
    if (a)
        if (a.srcBarrel != a) barrel_bucketTap(a.srcBarrel, c);
        else {
            if (8 == c || 10 == c || 1 == c)
                if (c != a.liquid && a.liquid) clientMessage("another liquid in this barrel");
                else if (a.volume >= a.maxVolume) clientMessage("barrel is full");
            else {
                var d = Player.getCarriedItemCount(),
                    e = 0;
                1 < d && (id = 325);
                Entity.setCarriedItem(getPlayerEnt(), 325, d - 1, 0);
                addItemInventory(325, 1, 0);
                a.volume++;
                a.liquid = c
            } else if (0 == c)
                if (!a.liquid || 1 > a.volume) clientMessage("no liquid here");
                else if (isBucketLiquid(a.liquid)) {
                var d =
                    Player.getCarriedItemCount(),
                    f = a.liquid,
                    e = 325;
                4 == f && (e = 464, f = 0);
                5 == f && (e = 467, f = 0);
                6 == f && (e = 466, f = 0);
                7 == f && (e = 465, f = 0);
                Entity.setCarriedItem(getPlayerEnt(), 325, d - 1, 0);
                addItemInventory(e, 1, f);
                a.volume--
            } else clientMessage("cant put this in a bucket");
            preventDefault()
        }
}
var batBox_itemsToCharge = {
    509: 60,
    510: 60,
    499: 4,
    494: 10,
    302: 30,
    303: 30,
    304: 30,
    305: 30,
    462: 10,
    463: 10,
    452: 40,
    453: 40,
    454: 40,
    455: 40,
    445: 10,
    444: 100
};

function MachineBatBox() {
    this.parent = MachineBase;
    this.parent();
    this.id = 210;
    this.getMachineName = function() {
        return "bat-box"
    };
    this.itemsToCharge = batBox_itemsToCharge;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 4E4
    };
    this.getEnergyOutput = function(a) {
        if (0 != Level.getTime() % 4) return 0;
        if (256 < this.getEnergyStored(a)) return a.energyStored -= 256, 256;
        var c = a.energyStored;
        a.energyStored = 0;
        return c
    };
    this.getContainerId = function() {
        return 1
    };
    this.updateMachine = function(a) {
        if (0 ==
            Level.getTime() % 2) {
            this.getEnergyStored(a);
            var c = this.getContainer(a).getSlot(0);
            if (0 < this.itemsToCharge[c.id] && 1 < c.data)
                for (var d = 0; 100 <= a.energyStored && 8 > d && 1 < c.data;) d++, c.data--, a.energyStored -= this.itemsToCharge[c.id]
        }
    }
}

function MachineMFE() {
    this.parent = MachineBatBox;
    this.parent();
    this.id = 235;
    this.getMaxEnergyStored = function() {
        return 6E5
    };
    this.getMachineName = function() {
        return "MFE"
    }
}

function MachineMFSU() {
    this.parent = MachineBatBox;
    this.parent();
    this.id = 252;
    this.getMaxEnergyStored = function() {
        return 1E7
    };
    this.getMachineName = function() {
        return "MFSU"
    }
}

function MachineReactorCell() {
    this.parent = MachineBase;
    this.parent();
    this.id = 130;
    this.canDeactivate = function() {
        return !1
    };
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 1
    };
    this.getContainer = function(a) {
        if (a.reactor) {
            if (a.reactor.container) return a.reactor.container;
            a.reactor.container = new Container(6);
            return a.reactor.container
        }
        return null
    };
    this.updateMachine = function(a) {
        a.reactor && a.reactor.removed && (a.reactor = null)
    };
    this.getGUIMetadata = function(a) {
        return a.reactor &&
            a.reactor.cells ? a.reactor.cells.length : 0
    };
    this.onDestroy = function(a) {
        var c = this.getContainer(a);
        if (c) {
            c.dropInv(a.x, a.y, a.z);
            for (var d in c.slots) c.slots[d] = {
                id: 0,
                data: 0,
                count: 0
            }
        }
    }
}

function MachineNuclearReactor() {
    this.parent = MachineBase;
    this.parent();
    this.id = 212;
    this.getInfo = function(a) {
        return "heat: " + a.temp
    };
    this.getMachineName = function() {
        return "nuclear reactor"
    };
    this.getContainerId = function() {
        return 6
    };
    this.getGUIMetadata = function(a) {
        return a.cells ? a.cells.length : 0
    };
    this.updateMachine = function(a) {
        this.initValues(a);
        this.cacheCells(a);
        if (0 == Level.getTime() % 20) {
            var c = this.getContainer(a),
                d = a.temp;
            this.provideReactionFrame(a, c);
            d < a.temp && 0 == Level.getTime() % 40 && this.playSound(a,
                "Generators/NuclearReactor/NuclearReactorLoop.ogg");
            1500 > d && 1500 < a.temp && clientMessage(" nuclear reactor is nearby to explode!");
            2E3 < a.temp && (removeMachine(a.x, a.y, a.z), explode(a.x, a.y, a.z, 20))
        }
    };
    this.initValues = function(a) {
        a.temp || (a.temp = 0);
        this.getEnergyStored(a)
    };
    this.canDeactivate = function() {
        return !1
    };
    this.provideReactionFrame = function(a, c) {
        for (var d = 0; 32 > d; d++) {
            if (504 == c.slots[d].id) {
                var e = this.getEnergyAndHeating(c, d);
                a.temp += e.heat;
                a.energyStored = Math.min(a.energyStored + 20 * e.energy, this.getMaxEnergyStored());
                this.damageSlot(c, d, Math.min(e.heat, 1))
            }
            505 == c.slots[d].id && 0 < a.temp && (a.temp--, this.damageSlot(c, d, 1));
            325 == c.slots[d].id && 8 == c.slots[d].data && 1E3 < a.temp && (a.temp -= 300, c.slots[d].data = 0);
            332 == c.slots[d].id && 500 < a.temp && (a.temp -= 50, c.slots[d].count--, 1 > c.slots[d].count && (c.slots[d].data = 0))
        }
        0 < a.temp && a.temp--;
        0 > a.temp && (a.temp = 0)
    };
    this.getEnergyAndHeating = function(a, c) {
        var d = c - 1,
            e = c + 4,
            f = c + 1,
            g = c - 4,
            h = this.getHeating(a, d) + this.getHeating(a, f) + this.getHeating(a, g) + this.getHeating(a, e) + this.getHeating(a,
                c);
        0 > h && (h = 0);
        d = this.getEnergy_(a, d) + this.getEnergy_(a, f) + this.getEnergy_(a, g) + this.getEnergy_(a, e) + this.getEnergy_(a, c);
        return {
            heat: h,
            energy: d
        }
    };
    this.getHeating = function(a, c) {
        var d = a.slots[c];
        return d ? 504 == d.id ? 1 : 505 == d.id ? (this.damageSlot(a, c, 1), -1) : 0 : 0
    };
    this.damageSlot = function(a, c, d) {
        a = a.slots[c];
        c = 1024;
        505 == a.id && (c = 4096);
        var e = a.data,
            e = e + d;
        e >= c && (a.id = a.count = a.data = e = 0);
        a.data = e
    };
    this.getEnergy_ = function(a, c) {
        var d = a.slots[c];
        return d ? 504 == d.id ? 1 : 0 : 0
    };
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 3E4
    };
    this.isGenerator = function() {
        return !0
    };
    this.getEnergyOutput = function(a) {
        return 128 < this.getEnergyStored(a) ? (a.energyStored -= 128, 128) : 0
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "temp", c.temp)
    };
    this.read = function(a, c) {
        c.temp = DataSaver.ReadNumber(a + "temp")
    };
    this.cacheCells = function(a) {
        if (0 == Level.getTime() % 23) {
            a.cells = [];
            var c = [
                    [a.x - 1, a.y, a.z],
                    [a.x + 1, a.y, a.z],
                    [a.x, a.y - 1, a.z],
                    [a.x, a.y + 1, a.z],
                    [a.x, a.y, a.z - 1],
                    [a.x, a.y, a.z + 1]
                ],
                d;
            for (d in c) {
                var e = c[d][0],
                    f =
                    c[d][1],
                    g = c[d][2];
                130 == getTile(e, f, g) && (e = getMachine(e, f, g)) && (a.cells.push(e), e.reactor = a)
            }
        }
    }
}

function MachineTeleporter() {
    this.parent = MachineBase;
    this.parent();
    this.id = 218;
    this.getMachineName = function() {
        return "teleporter"
    };
    this.getInfo = function(a) {
        return "frequency " + this.getFreq(a)
    };
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 2E4
    };
    this.teleportEntity = function(a, c) {
        if (1E3 > this.getEnergyStored(c)) clientMessage("no energy");
        else {
            var d = [],
                e;
            for (e in this.MachineCoords) {
                var f = this.MachineCoords[e];
                this.getFreq(f) == this.getFreq(c) && c != f && d.push(f)
            }
            if (0 < d.length) return d =
                d[parseInt(Math.random() * d.length)], setPosition(a, d.x + .5, d.y + 3.12, d.z + .5), c.energyStored -= 1E3, clientMessage("teleported " + Player.getName(a) + " to " + d.x + ", " + d.y + ", " + d.z), !0;
            clientMessage("no teleporters on current frequency")
        }
    };
    this.wrenchClick = function(a) {
        a.freq = (this.getFreq(a) + 1) % 16;
        clientMessage("changed frequency to " + a.freq)
    };
    this.getFreq = function(a) {
        a.freq || (a.freq = 0);
        return a.freq
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "#freq", this.getFreq(c))
    };
    this.read = function(a, c) {
        c.freq = DataSaver.ReadNumber(a +
            "#freq")
    }
}

function CreateMillRender(a, c) {
    model = a.getModel();
    model.getPart("head").clear();
    model.getPart("body").clear();
    model.getPart("rightArm").clear();
    model.getPart("leftArm").clear();
    model.getPart("rightLeg").clear();
    model.getPart("leftLeg").clear();
    bipedBody = model.getPart("head");
    bipedBody.setTextureOffset(0, 0);
    bipedBody.addBox(-2, -2, -2, 4, 32, 4);
    bipedBody.addBox(-2, -2, -2, 4, 4, 32);
    bipedBody.addBox(-2, -30, -2, 4, 32, 4);
    bipedBody.addBox(-2, -2, -30, 4, 4, 32);
    bipedBody.setTextureSize(1, 1)
}
var millRenderer = Renderer.createHumanoidRenderer();
CreateMillRender(millRenderer);

function MachineWindmill() {
    this.parent = MachineBase;
    this.parent();
    this.id = 219;
    this.getMachineName = function() {
        return "windmill"
    };
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 1
    };
    this.isGenerator = function() {
        return !0
    };
    this.getEnergyOutput = function(a) {
        if (0 == Level.getTime() % 20) {
            var c = getTile(a.x - 4 + 9 * Math.random(), a.y - 4 + 9 * Math.random(), a.z - 4 + 9 * Math.random());
            a = Math.max(0, (a.y - 64) / 63 * 5);
            if (0 == c) return Math.floor(20 * a)
        }
        return 0
    }
}

function MachineWatermill() {
    this.parent = MachineBase;
    this.parent();
    this.id = 220;
    this.getMachineName = function() {
        return "watermill"
    };
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 1
    };
    this.isGenerator = function() {
        return !0
    };
    this.getEnergyOutput = function(a) {
        return 0 == Level.getTime() % 20 && (a = getTile(a.x - 1 + 3 * Math.random(), a.y - 1 + 3 * Math.random(), a.z - 1 + 3 * Math.random()), 8 == a || 9 == a) ? 8 : 0
    }
}

function MachineGenGeotermal() {
    this.parent = MachineBase;
    this.parent();
    this.id = 221;
    this.getMachineName = function() {
        return "geotermal generator"
    };
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 200
    };
    this.isGenerator = function() {
        return !0
    };
    this.getContainerId = function() {
        return 3
    };
    this.updateMachine = function(a) {
        if (!a.volume || 0 > a.volume) a.volume = 0;
        0 < a.volume && 60 > this.getEnergyStored(a) && (a.energyStored += 20, a.volume -= .001);
        0 == Level.getTime() % 40 && 0 < a.volume && this.playSound(a,
            "Generators/GeothermalLoop.ogg");
        var c = this.getContainer(a);
        c.setLiquidBar(a.volume / 16, 10);
        15 >= a.volume && 0 == Level.getTime() % 20 && (c = c.getSlot(0), 325 == c.id && 10 == c.data && 16 > a.volume && (c.data = 0, a.volume++), 208 == getTile(a.x, a.y + 1, a.z) && (c = getMachine(a.x, a.y + 1, a.z)) && 10 == c.liquid && 1 <= c.volume && (c.volume--, a.volume++))
    };
    this.getEnergyOutput = function(a) {
        if (0 < this.getEnergyStored(a) && 0 == Level.getTime() % 8) {
            var c = a.energyStored;
            a.energyStored = 0;
            return c
        }
        return 0
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "#vol",
            c.volume)
    };
    this.read = function(a, c) {
        c.volume = DataSaver.ReadNumber(a + "#vol")
    }
}

function MachinePump() {
    this.parent = MachineBase;
    this.parent();
    this.id = 222;
    this.getMachineName = function() {
        return "pump"
    };
    this.updateMachine = function(a) {
        if (0 == Level.getTime() % 20)
            if (208 == getTile(a.x, a.y - 1, a.z)) {
                var c = getLiquidTypeAtCoords(a.x, a.y - 1, a.z);
                0 != c && this.sendLiquidBucket(a, c) && pullBucketOfLiquid(a.x, a.y - 1, a.z)
            } else {
                var d = this.getPumpingCoords(a);
                null != d && (c = getLiquidTypeAtCoords(d.x, d.y, d.z)) && this.sendLiquidBucket(a, c) && (pullBucketOfLiquid(d.x, d.y, d.z), updateNearbyOil(d.x, d.y, d.z))
            }
    };
    this.sendLiquidBucket =
        function(a, c) {
            a.pipeUpdated_ && a.pipeConnections || (RebuildPipeConnections(a), a.pipeUpdated_ = !0, a.receiverUpdated_ = !1);
            a.receiverUpdated_ && a.rData || (this.rebuildReceiverData(a), a.receiverUpdated_ = !0);
            for (var d in a.rData) {
                var e = a.rData[d];
                if (barrel_addBucket(e, c)) return !0
            }
            return 208 == getTile(a.x, a.y + 1, a.z) && (e = getMachine(a.x, a.y + 1, a.z)) ? barrel_addBucket(e, c) : !1
        };
    this.recive = function(a, c, d, e) {
        a = [
            [a + 1, c, d],
            [a - 1, c, d],
            [a, c + 1, d],
            [a, c - 1, d],
            [a, c, d + 1],
            [a, c, d - 1]
        ];
        for (var f in a) {
            c = a[f][0];
            d = a[f][1];
            var g = a[f][2];
            if (208 == getTile(c, d, g) && (c = getMachine(c, d, g)) && barrel_addBucket(c, e)) return !0
        }
    };
    this.getLiquid = function(a) {
        var c = getTile(a.x, a.y - 1, a.z);
        if (0 != Level.getData(a.x, a.y - 1, a.z)) return 0;
        if (8 == c || 9 == c) return Level.destroyBlock(a.x, a.y - 1, a.z), 8;
        if (10 == c || 11 == c) return Level.destroyBlock(a.x, a.y - 1, a.z), 10
    };
    this.rebuildReceiverData = function(a) {
        a.rData = [];
        for (var c in a.pipeConnections) {
            var d = a.pipeConnections[c];
            if (!d || !d.dst) break;
            var e = d.dst.x,
                f = d.dst.y,
                d = d.dst.z,
                e = [
                    [e + 1, f, d],
                    [e - 1, f, d],
                    [e, f + 1, d],
                    [e, f - 1, d],
                    [e, f, d + 1],
                    [e, f, d - 1]
                ],
                g;
            for (g in e) {
                var f = e[g][0],
                    d = e[g][1],
                    h = e[g][2];
                208 == getTile(f, d, h) && (f = getMachine(f, d, h)) && a.rData.push(f)
            }
        }
    };
    this.getPumpingCoords = function(a) {
        var c = a.x,
            d = a.y - 1;
        for (a = a.z; 0 == getTile(c, d, a) && 60 < d;) d--;
        getTile(c, d, a);
        return this.getCoordsForLevel(c, d, a)
    };
    this.getCoordsForLevel = function(a, c, d, e, f, g) {
        f || (f = []);
        g || (g = 0);
        var h = a + "#" + c + "#" + d;
        if (f[h]) return null;
        f[h] = !0;
        g++;
        e || (e = 9);
        var k = getTile(a, c, d),
            h = Level.getData(a, c, d);
        if (h >= e) return null;
        e = null;
        this.isLiquidSource(k, h) && (e =
            new Coords(a, c, d));
        if (!this.isLiquidFlow(k, h) && !e || 32 < g) return e;
        a = [
            [a + 1, c, d],
            [a - 1, c, d],
            [a, c, d + 1],
            [a, c, d - 1],
            [a, c - 1, d],
            [a, c + 1, d]
        ];
        for (var l in a)
            if (c = this.getCoordsForLevel(a[l][0], a[l][1], a[l][2], h, f, g), null != c) return c;
        return e
    };
    this.isLiquidSource = function(a, c) {
        return (8 == a || 9 == a || 10 == a || 11 == a) && 0 == c || 176 == a
    };
    this.isLiquidFlow = function(a, c) {
        return (8 == a || 9 == a || 10 == a || 11 == a) && 0 < c || 177 == a
    };
    this.isLiquidFall = function(a, c) {
        return (8 == a || 9 == a || 10 == a || 11 == a) && 8 == c || 177 == a && 0 == c
    }
}

function MachineAutoMilker() {
    this.parent = MachineBase;
    this.parent();
    this.id = 223;
    this.updateMachine = function(a) {
        a.cooldown || (a.cooldown = 0);
        0 < a.cooldown && a.cooldown--;
        if (0 == Level.getTime() % 20 && this.tryGetMilk(a.x + .5, a.y + .5, a.z + .5) && 1 > a.cooldown && 208 == getTile(a.x, a.y + 1, a.z)) {
            var c = getMachine(a.x, a.y + 1, a.z);
            c && barrel_addBucket(c, LIQUID_MILK) && (a.cooldown = 200)
        }
    };
    this.getMachineName = function() {
        return "auto-milker"
    };
    this.tryGetMilk = function(a, c, d) {
        var e = eh_getRandomByType(11);
        if (!e) return !1;
        var f = Entity.getX(e),
            g = Entity.getY(e),
            e = Entity.getZ(e);
        if (3 > Math.sqrt((f - a) * (f - a) + (g - c) * (g - c) + (e - d) * (e - d))) return !0
    }
}

function MachineFiller() {
    this.parent = MachineBase;
    this.parent();
    this.id = 224;
    this.updateMachine = function(a) {
        if (0 == Level.getTime() % 22 && 208 == getTile(a.x, a.y - 1, a.z)) {
            var c = getMachine(a.x, a.y - 1, a.z);
            a = getChest(a.x, a.y + 1, a.z);
            if (c && a.exist && c.volume && c.liquid && isBucketLiquid(c.liquid)) {
                var d = a.getItem(325, 1, 0);
                if (d.count) {
                    var e = 325,
                        f = c.liquid;
                    4 == c.liquid && (e = 464, f = 0);
                    5 == c.liquid && (e = 467, f = 0);
                    6 == c.liquid && (e = 466, f = 0);
                    7 == c.liquid && (e = 465, f = 0);
                    d.data = f;
                    c.volume--;
                    d.id = e
                }
                a.addItem(d.id, d.count, d.data)
            }
        }
    };
    this.getMachineName =
        function() {
            return "bucket filler"
        }
}

function MachineGrowthAccelerator() {
    this.parent = MachineBase;
    this.parent();
    this.id = 225;
    this.getMachineName = function() {
        return "growth accelerator"
    };
    this.updateMachine = function(a) {
        if (0 == Level.getTime() % 10) {
            var c = Level.getTime() / 10 % 121,
                d = a.x - 5 + Math.floor(c / 11),
                c = a.z - 5 + Math.floor(c % 11);
            if (208 == getTile(a.x, a.y + 1, a.z)) {
                var e = getMachine(a.x, a.y + 1, a.z);
                if (e && 8 == e.liquid)
                    for (var f = a.y - 1; f < a.y + 2; f++)
                        if (this.tryAccelerate(d, f, c)) {
                            e.volume--;
                            break
                        }
            }
        }
    };
    this.tryAccelerate = function(a, c, d) {
        var e = [59, 104, 105, 141, 142,
                244
            ],
            f = getTile(a, c, d),
            g;
        for (g in e)
            if (f == e[g]) return e = Level.getData(a, c, d), 7 > e && setTile(a, c, d, f, e + 1), !0
    }
}

function MachineMobSlayer() {
    this.parent = MachineBase;
    this.parent();
    this.id = 226;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 500
    };
    this.updateMachine = function(a) {
        animateRange(ParticleType.redstone, a.x + .5, a.y + .5, a.z + .5, 6);
        if (!(.29 < Math.random())) {
            a.cachedEntities || (a.cachedEntities = []);
            a.cooldown && a.cooldown--;
            var c = Level.getTime() % 7 + 10;
            if (!(500 > this.getEnergyStored(a)))
                if (14 > c) {
                    var c = eh_getRandomByType(c),
                        d = this.isInRange(a.x, a.y, a.z, c),
                        e = d,
                        f;
                    for (f in a.cachedEntities)
                        if (a.cachedEntities[f] ==
                            c)
                            if (d) e = !1;
                            else {
                                a.cachedEntities.splice(f, 1);
                                this.markEntity(c, "");
                                break
                            }
                    e && (this.markEntity(c, "will be slayed"), a.cachedEntities.push(c))
                } else 14 != c || a.cooldown || (a.destructCount || (a.destructCount = 1), a.cachedEntities.length <= a.destructCount || (f = getChest(a.x, a.y + 1, a.z), f.exist && this.slayMob(a, a.cachedEntities.pop(), f)))
        }
    };
    this.isInRange = function(a, c, d, e) {
        var f = Entity.getX(e),
            g = Entity.getY(e);
        e = Entity.getZ(e);
        return 5 > Math.sqrt((f - a) * (f - a) + (g - c) * (g - c) + (e - d) * (e - d))
    };
    this.markEntity = function(a, c) {
        Entity.getEntityTypeId(a)
    };
    this.slayMob = function(a, c, d) {
        var e = Entity.getEntityTypeId(c);
        this.animateSlay(a, c);
        Entity.remove(c);
        c = this.getDropByType(e);
        for (var f in c) d.addItem(c[f], 1, 0);
        a.energyStored -= 500;
        a.cooldown = 75
    };
    this.animateSlay = function(a, c) {
        var d = Entity.getX(c),
            e = Entity.getY(c),
            f = Entity.getZ(c);
        animateCoords(5, d, e + .5, f)
    };
    this.getDropByType = function(a) {
        var c = [];
        10 == a && (c.push(366), .5 > Math.random() && c.push(288));
        if (12 == a)
            for (var d = 0; d < 3 * Math.random(); d++) c.push(320);
        13 == a && c.push(35);
        if (11 == a) {
            for (d = 0; d < 3 * Math.random(); d++) c.push(364);
            for (d = 0; d < 3 * Math.random(); d++) c.push(334)
        }
        return c
    };
    this.wrenchClick = function(a) {
        a.destructCount++;
        if (!a.destructCount || 8 < a.destructCount) a.destructCount = 1;
        clientMessage("slay trigger count changed to " + a.destructCount)
    };
    this.getMachineName = function() {
        return "mob slayer"
    };
    this.getInfo = function(a) {
        return "slay trigger count " + a.destructCount
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "stc", c.destructCount)
    };
    this.read = function(a, c) {
        c.destructCount = DataSaver.ReadNumber(a + "stc")
    }
}

function MachineMobFeeder() {
    this.parent = MachineBase;
    this.parent();
    this.id = 227;
    this.updateMachine = function(a) {
        if (!(.29 < Math.random())) {
            a.entityCache || (a.entityCache = []);
            a.cooldown && a.cooldown--;
            var c = Level.getTime(),
                d = c % 4 + 10;
            if (4 > c % 12) {
                a.entityCache[d] || (a.entityCache[d] = []);
                var c = eh_getRandomByType(d),
                    e = this.isInRange(a.x, a.y, a.z, c),
                    f = e,
                    g;
                for (g in a.entityCache[d])
                    if (a.entityCache[d][g] == c)
                        if (e) f = !1;
                        else {
                            a.entityCache[d].splice(g, 1);
                            break
                        }
                f && a.entityCache[d].push(c)
            } else 8 > c % 12 && !a.cooldown && (d = parseInt(10 +
                4 * Math.random()), !a.entityCache[d] || 2 > a.entityCache[d].length || (g = getChest(a.x, a.y + 1, a.z), g.exist && (c = this.getFeedItemForType(d), c = g.getItem(c, 2, 0), 2 == c.count && (c.count = 0, this.mateMobs(a.entityCache[d][1], a.entityCache[d][0]), a.cooldown = 1200), g.addItem(c.id, c.count, c.data))))
        }
    };
    this.getFeedItemForType = function(a) {
        return 296
    };
    this.isInRange = function(a, c, d, e) {
        var f = Entity.getX(e),
            g = Entity.getY(e);
        e = Entity.getZ(e);
        return 2.5 > Math.sqrt((f - a) * (f - a) + (g - c) * (g - c) + (e - d) * (e - d))
    };
    this.mateMobs = function(a, c) {
        var d =
            Entity.getX(a),
            e = Entity.getY(a),
            f = Entity.getZ(a),
            g = Entity.getX(c),
            h = Entity.getY(c),
            k = Entity.getZ(c);
        Level.spawnMob((d + g) / 2, (e + h) / 2, (f + k) / 2, Entity.getEntityTypeId(a));
        animateCoords(14, d, e, f);
        animateCoords(14, g, h, k)
    };
    this.wrenchClick = function(a) {
        clientMessage(this.getInfo(a))
    };
    this.getMachineName = function() {
        return "mob feeder"
    };
    this.getInfo = function(a) {
        return "next feed in " + (a.cooldown ? parseInt(a.cooldown / 20) : 0) + "s"
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "feedcd", c.cooldown)
    };
    this.read = function(a,
        c) {
        c.cooldown = DataSaver.ReadNumber(a + "feedcd")
    }
}

function MachineMonsterDefender() {
    this.parent = MachineBase;
    this.parent();
    this.id = 228;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 1E4
    };
    this.getMachineName = function() {
        return "monster defender"
    };
    this.updateMachine = function(a) {
        var c = Level.getTime();
        a.currentTarget && 0 == c % 6 ? (50 <= this.getEnergyStored(a) && (this.hitMob(a.currentTarget, a), a.energyStored -= 50), 1 > Entity.getY(a.currentTarget) && (a.currentTarget = 0)) : (c = parseInt(32 + 5 * Math.random()), (c = eh_getRandomByType(c)) && this.isInRange(a.x,
            a.y, a.z, c) && (a.currentTarget = c))
    };
    this.hitMob = function(a) {
        var c = Entity.getX(a),
            d = Entity.getY(a),
            e = Entity.getZ(a);
        Entity.setHealth(a, Entity.getHealth(a) - 3);
        for (a = 0; a < 5 * Math.random(); a++) Level.addParticle(5, c, d + .7, e, .1 * (Math.random() - .5), .1 * (Math.random() - .5), .1 * (Math.random() - .5), 1)
    };
    this.isInRange = function(a, c, d, e) {
        var f = Entity.getX(e),
            g = Entity.getY(e);
        e = Entity.getZ(e);
        return 32 > Math.sqrt((f - a) * (f - a) + (g - c) * (g - c) + (e - d) * (e - d))
    }
}

function MachineAssembler() {
    this.parent = MachineBase;
    this.parent();
    this.id = 229;
    this.getContainerId = function() {
        return 5
    };
    this.allRecipes = [];
    this.getMachineName = function() {
        return "assembler"
    };
    this.getInfo = function(a) {
        return (a = this.allRecipes[a.recID]) ? "recipe: " + this.getItemName(a.res.id, a.res.data) : "no recipe"
    };
    this.updateMachine = function(a) {
        a.recID || (a.recID = -1);
        a.currentAnimation && (this.animateItem(a, a.currentAnimation, 3), a.currLiquid && this.animateLiquid(a, a.currLiquid));
        var c = Level.getTime();
        0 == c %
            8 && this.setIcons(a);
        0 == c % 30 && this.doCraft(a)
    };
    this.setIcons = function(a) {
        var c = this.allRecipes[a.recID];
        a = this.getContainer(a);
        if (c) {
            var d = [],
                e;
            for (e in c.ing) {
                var f = c.ing[e][0],
                    g = c.ing[e][1];
                0 != f && d.push({
                    id: f,
                    data: g,
                    x: 148 + e % 3 * 28,
                    y: 33 + 28 * parseInt(e / 3)
                })
            }
            d.push({
                id: c.res.id,
                x: 232,
                y: 61
            });
            a.setItemIcons(d)
        } else a.setItemIcons([])
    };
    this.itemClick = function(a, c, d, e) {
        preventDefault();
        if (!a.isChanging) return a.isChanging = !1;
        for (var f in this.allRecipes)
            if (e = this.allRecipes[f], e.res.id == c && (!(256 > c && 5 < c &&
                    35 != c || 351 == c) || e.res.data != d)) {
                a.recID = f;
                clientMessage("changed recipe to " + ChatColor.RED + Item.getName(e.res.id, e.res.data, !0).split(".")[1]);
                this.animateItem(a, e.part, 100);
                return
            }
        clientMessage("no such recipe")
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "recID", c.recID)
    };
    this.read = function(a, c) {
        c.recID = DataSaver.ReadNumber(a + "recID")
    };
    this.addRecipe = function(a, c, d, e, f, g, p) {
        this.allRecipes.push({
            res: {
                id: a,
                count: c,
                data: d
            },
            liquid: f || 0,
            ing: e,
            name: g,
            part: p
        })
    };
    this.animateItem = function(a, c, d) {
        for (var e =
                0; e < d; e++) {
            var f = a.x + Math.random();
            Math.random();
            var g = a.z + Math.random();
            parseInt(c.length * Math.random())
        }
    };
    this.animateLiquid = function(a, c) {
        for (var d = 0; 2 > d; d++) {
            var e = c,
                f = 9,
                g = -1;
            if (!e) break;
            1 == e && (e = 42);
            8 == e && (e = 27);
            10 == e && (e = 19);
            19 == e && (e = 1, f = ParticleType.flame, g = -.03);
            var p = Math.random(),
                q = Math.random();.5 > Math.random() ? p = Math.floor(p + .5) : q = Math.floor(q + .5);
            0 == p && (p = -.05);
            0 == q && (q = -.05);
            1 == p && (p = 1.05);
            1 == q && (q = 1.05);
            Level.addParticle(f, a.x + p, Math.random() + a.y, a.z + q, 0, g, 0, e)
        }
    };
    this.getItemName =
        function(a, c) {
            return 351 == a && 3 == c ? "cocoa beans" : Item.getName(a, c, !0).split(".")[1]
        };
    this.getLiquidName = function(a) {
        return 0 == a ? ChatColor.WHITE + "none" : 1 == a ? ChatColor.WHITE + "milk" : 8 == a ? ChatColor.BLUE + "water" : 10 == a ? ChatColor.RED + "lava" : ChatColor.YELLOW + "unknown"
    };
    this.getIngInfo = function(a) {
        var c = [],
            d;
        for (d in a) {
            var e = this.getItemName(a[d][0], a[d][1]);
            c[e] || (c[e] = 0);
            c[e]++
        }
        a = "";
        for (e in c) a += e + ChatColor.YELLOW + " x" + c[e] + "\n";
        return a
    };
    this.wrenchClick = function(a) {
        var c = this.allRecipes[a.recID];
        a.isChanging = !0;
        a = c ? "\nrecipe: " + ChatColor.RED + this.getItemName(c.res.id, c.res.data) : "no recipe";
        clientMessage(a);
        clientMessage("Tap with item to change recipe")
    };
    this.doCraft = function(a) {
        var c = this.allRecipes[a.recID];
        if (!c) return [0, 0, 0];
        for (var d = [], e = this.getContainer(a), f = 0; 9 > f; f++) {
            var g = e.getSlot(f).id,
                p = e.getSlot(f).count,
                q = e.getSlot(f).data;
            0 != g && (d[g + ":" + q] || (d[g + ":" + q] = 0), d[g + ":-1"] || (d[g + ":-1"] = 0), d[g + ":" + q] += p, d[g + ":-1"] += p)
        }
        e = [];
        for (f in c.ing) g = c.ing[f][0], q = c.ing[f][1], 0 != g && (e[g + ":" + q] || (e[g + ":" +
            q] = 0), e[g + ":" + q]++);
        var f = !0,
            t;
        for (t in e)
            if (e[t] > d[t] || !d[t]) f = !1;
        if (!f) return [0, 0, 0];
        if (this.hasPlaceFor(a, c.res.id, c.res.count, c.res.data))
            for (t in this.putToInv(a, c.res.id, c.res.count, c.res.data), e) g = parseInt(t.split(":")[0]), p = e[t], q = parseInt(t.split(":")[1]), this.getFromInv(a, g, p, q)
    };
    this.getFromInv = function(a, c, d, e) {
        a = this.getContainer(a);
        for (var f = 0; 9 > f && !(0 >= d); f++) {
            var g = a.getSlot(f);
            if (g.id == c && (g.data == e || -1 == e)) {
                var p = g.count;
                g.count = Math.max(0, g.count - d);
                d -= p - g.count;
                0 == g.count && (g.id =
                    0)
            }
        }
    };
    this.putToInv = function(a, c, d, e) {
        a = this.getContainer(a);
        for (var f = 0; 9 > f && !(0 >= d); f++) {
            var g = a.getSlot(f);
            if (g.id == c && g.data == e || 0 == g.id) {
                var p = g.count;
                g.count = Math.min(64, g.count + d);
                d -= g.count - p;
                g.id = c
            }
        }
    };
    this.hasPlaceFor = function(a, c, d, e) {
        a = this.getContainer(a);
        for (var f = 0; 9 > f && !(0 >= d); f++) {
            var g = a.getSlot(f);
            if (g.id == c && g.data == e || 0 == g.id) d -= 64 - g.count
        }
        return 0 >= d
    };
    for (var a in AutoCraftRecipeList) {
        for (var c = parseInt(a.split(":")[0]), d = parseInt(a.split(":")[1]), e = parseInt(a.split(":")[2]),
                f = [], g = 0; 9 > g; g++) f.push([AutoCraftRecipeList[a][2 * g], AutoCraftRecipeList[a][2 * g + 1]]);
        this.addRecipe(c, d, e, f, 0, 0, 0)
    }
}
var AutoCraftRecipeList = {
    "5:4:0": [17, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "22:1:0": [351, 4, 351, 4, 351, 4, 351, 4, 351, 4, 351, 4, 351, 4, 351, 4, 351, 4],
    "24:1:0": [12, 0, 12, 0, 0, 0, 12, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "24:1:0": [44, 1, 0, 0, 0, 0, 0, 0, 44, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    "24:4:2": [24, 0, 24, 0, 0, 0, 24, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "27:6:0": [266, 0, 0, 0, 266, 0, 266, 0, 280, 0, 266, 0, 266, 0, 331, 0, 266, 0],
    "35:1:0": [287, 0, 287, 0, 0, 0, 287, 0, 287, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "5:4:0": [17, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "41:1:0": [266, 0, 266, 0, 266, 0, 266, 0, 266, 0, 266, 0,
        266, 0, 266, 0, 266, 0
    ],
    "42:1:0": [265, 0, 265, 0, 265, 0, 265, 0, 265, 0, 265, 0, 265, 0, 265, 0, 265, 0],
    "44:6:3": [4, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "44:6:0": [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "44:6:1": [24, 0, 24, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "44:6:4": [45, 0, 45, 0, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "44:6:5": [98, 0, 98, 0, 98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "44:6:6": [155, 0, 155, 0, 155, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "45:1:0": [336, 0, 336, 0, 0, 0, 336, 0, 336, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "46:1:0": [289, 0, 12, 0, 289, 0, 12, 0, 289, 0, 12, 0, 289, 0, 12, 0, 289, 0],
    "47:1:0": [5,
        0, 5, 0, 5, 0, 340, 0, 340, 0, 340, 0, 5, 0, 5, 0, 5, 0
    ],
    "48:1:0": [4, 0, 106, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "50:4:0": [0, 0, 263, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "50:4:0": [0, 0, 263, 1, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "53:4:0": [5, 0, 0, 0, 0, 0, 5, 0, 5, 0, 0, 0, 5, 0, 5, 0, 5, 0],
    "54:1:0": [5, 0, 5, 0, 5, 0, 5, 0, 0, 0, 5, 0, 5, 0, 5, 0, 5, 0],
    "57:1:0": [264, 0, 264, 0, 264, 0, 264, 0, 264, 0, 264, 0, 264, 0, 264, 0, 264, 0],
    "58:1:0": [5, 0, 5, 0, 0, 0, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "61:1:0": [4, 0, 4, 0, 4, 0, 4, 0, 0, 0, 4, 0, 4, 0, 4, 0, 4, 0],
    "65:2:0": [280, 0, 0, 0, 280, 0, 280, 0, 280, 0, 280, 0, 280, 0, 0, 0, 280,
        0
    ],
    "50:4:0": [0, 0, 263, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "66:16:0": [265, 0, 0, 0, 265, 0, 265, 0, 280, 0, 265, 0, 265, 0, 0, 0, 265, 0],
    "67:4:0": [4, 0, 0, 0, 0, 0, 44, 0, 44, 0, 0, 0, 4, 0, 4, 0, 4, 0],
    "78:6:0": [80, 0, 80, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "82:1:0": [337, 0, 337, 0, 0, 0, 337, 0, 337, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "85:3:0": [5, 0, 280, 0, 5, 0, 5, 0, 280, 0, 5, 0, 0, 0, 0, 0, 0, 0],
    "85:3:1": [5, 1, 280, 0, 5, 1, 5, 2, 280, 0, 5, 1, 0, 0, 0, 0, 0, 0],
    "85:3:2": [5, 2, 280, 0, 5, 2, 5, 2, 280, 0, 5, 2, 0, 0, 0, 0, 0, 0],
    "85:3:3": [5, 3, 280, 0, 5, 3, 5, 3, 280, 0, 5, 3, 0, 0, 0, 0, 0, 0],
    "85:3:4": [5, 4, 280, 0, 5, 4, 5, 4,
        280, 0, 5, 4, 0, 0, 0, 0, 0, 0
    ],
    "85:3:5": [5, 5, 280, 0, 5, 5, 5, 5, 280, 0, 5, 5, 0, 0, 0, 0, 0, 0],
    "89:1:0": [348, 0, 348, 0, 0, 0, 348, 0, 348, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "91:1:0": [0, 0, 86, 0, 0, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "96:2:0": [5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0],
    "98:4:0": [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "101:16:0": [265, 0, 265, 0, 265, 0, 265, 0, 265, 0, 265, 0, 0, 0, 0, 0, 0, 0],
    "102:16:0": [20, 0, 20, 0, 20, 0, 20, 0, 20, 0, 20, 0, 0, 0, 0, 0, 0, 0],
    "103:1:0": [360, 0, 360, 0, 360, 0, 360, 0, 360, 0, 360, 0, 360, 0, 360, 0, 360, 0],
    "107:1:0": [280, 0, 5, 0, 280, 0, 280, 0, 5, 0, 280, 0, 0, 0,
        0, 0, 0, 0
    ],
    "108:4:0": [45, 0, 0, 0, 0, 0, 45, 0, 45, 0, 0, 0, 45, 0, 45, 0, 45, 0],
    "109:4:0": [98, 0, 0, 0, 0, 0, 98, 0, 98, 0, 0, 0, 98, 0, 98, 0, 98, 0],
    "112:1:0": [405, 0, 405, 0, 0, 0, 405, 0, 405, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "114:4:0": [112, 0, 0, 0, 0, 0, 112, 0, 112, 0, 0, 0, 112, 0, 112, 0, 112, 0],
    "128:4:0": [24, 0, 0, 0, 0, 0, 24, 0, 240, 0, 0, 24, 0, 24, 0, 24, 0],
    "134:4:0": [5, 1, 0, 0, 0, 0, 5, 1, 5, 1, 0, 0, 5, 1, 5, 1, 5, 1],
    "133:1:0": [338, 0, 338, 0, 338, 0, 338, 0, 338, 0, 338, 0, 338, 0, 338, 0, 338, 0],
    "135:4:0": [5, 2, 0, 0, 0, 0, 5, 2, 5, 2, 0, 0, 5, 2, 5, 2, 5, 2],
    "136:4:0": [5, 3, 0, 0, 0, 0, 5, 3, 5, 3, 0, 0, 5, 3, 5, 3, 5, 3],
    "139:6:0": [4,
        0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0
    ],
    "139:6:1": [48, 0, 48, 0, 48, 0, 48, 0, 48, 0, 48, 0, 0, 0, 0, 0, 0, 0],
    "155:1:0": [406, 0, 406, 0, 0, 0, 406, 0, 406, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "155:1:1": [44, 6, 0, 0, 0, 0, 44, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "155:2:2": [155, 0, 0, 0, 0, 0, 155, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "158:6:0": [5, 0, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "158:6:1": [5, 1, 5, 1, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "158:6:2": [5, 2, 5, 2, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "158:6:3": [5, 3, 5, 3, 5, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "158:6:4": [5, 4, 5, 4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "158:6:5": [5, 5,
        5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "159:8:15": [172, 0, 172, 0, 172, 0, 172, 0, 351, 0, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:14": [172, 0, 172, 0, 172, 0, 172, 0, 351, 1, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:13": [172, 0, 172, 0, 172, 0, 172, 0, 351, 2, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:12": [172, 0, 172, 0, 172, 0, 172, 0, 351, 3, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:11": [172, 0, 172, 0, 172, 0, 172, 0, 351, 4, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:10": [172, 0, 172, 0, 172, 0, 172, 0, 351, 5, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:9": [172, 0, 172, 0, 172, 0, 172, 0, 351, 6, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:8": [172, 0, 172, 0, 172, 0, 172, 0, 351, 7, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:7": [172, 0, 172, 0, 172, 0, 172, 0, 351, 8, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:6": [172, 0, 172, 0, 172, 0, 172, 0, 351, 9, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:5": [172, 0, 172, 0, 172, 0, 172, 0, 351, 10, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:4": [172, 0, 172, 0, 172, 0, 172, 0, 351, 11, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:3": [172, 0, 172, 0, 172, 0, 172, 0, 351, 12, 172, 0, 172, 0, 172, 0, 172, 0],
    "159:8:2": [172, 0, 172, 0, 172, 0, 172, 0, 351, 13, 172, 13, 172, 0, 172, 0, 172, 0],
    "159:8:1": [172, 0, 172, 0, 172, 0, 172, 0,
        351, 14, 172, 0, 172, 0, 172, 0, 172, 0
    ],
    "159:8:0": [172, 0, 172, 0, 172, 0, 172, 0, 351, 15, 172, 0, 172, 0, 172, 0, 172, 0],
    "163:4:0": [5, 4, 0, 0, 0, 0, 5, 4, 5, 4, 0, 0, 5, 4, 5, 4, 5, 4],
    "164:4:0": [5, 5, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 5, 5],
    "170:1:0": [296, 0, 296, 0, 296, 0, 296, 0, 296, 0, 296, 0, 296, 0, 296, 0, 296, 0],
    "171:3:0": [35, 0, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:1": [35, 1, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:2": [35, 2, 35, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:3": [35, 3, 35, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:4": [35, 4, 35, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0
    ],
    "171:3:5": [35, 5, 35, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:6": [35, 6, 35, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:8": [35, 8, 35, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:9": [35, 9, 35, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:10": [35, 10, 35, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:11": [35, 11, 35, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:12": [35, 12, 35, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:13": [35, 13, 35, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:14": [35, 14, 35, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "171:3:15": [35, 15, 35, 15, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "173:1:0": [263, 0, 263, 0, 263, 0, 263, 0, 263, 0, 263, 0, 263, 0, 263, 0, 263, 0],
    "183:1:0": [280, 0, 5, 1, 280, 0, 280, 0, 5, 1, 280, 0, 0, 0, 0, 0, 0, 0],
    "184:1:0": [280, 0, 5, 2, 280, 0, 280, 0, 5, 2, 280, 0, 0, 0, 0, 0, 0, 0],
    "185:1:0": [280, 0, 5, 3, 280, 0, 280, 0, 5, 3, 280, 0, 0, 0, 0, 0, 0, 0],
    "186:1:0": [280, 0, 5, 5, 280, 0, 280, 0, 5, 5, 280, 0, 0, 0, 0, 0, 0, 0],
    "187:1:0": [280, 0, 5, 4, 280, 0, 280, 0, 5, 4, 280, 0, 0, 0, 0, 0, 0, 0],
    "245:1:0": [4, 0, 4, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "247:1:0": [265, 0, 264, 0, 265, 0, 265, 0, 264, 0, 265, 0, 265, 0, 264, 0, 265, 0],
    "257:1:0": [265, 0,
        265, 0, 265, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0
    ],
    "256:1:0": [0, 0, 265, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "258:1:0": [265, 0, 265, 0, 0, 0, 265, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "259:1:0": [265, 0, 0, 0, 0, 0, 0, 0, 318, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "261:1:0": [0, 0, 280, 0, 287, 0, 280, 0, 0, 0, 287, 0, 0, 0, 280, 0, 287, 0],
    "262:4:0": [0, 0, 318, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 288, 0, 0, 0],
    "263:9:0": [173, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "264:9:0": [57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "265:9:0": [42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "266:9:0": [41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0
    ],
    "267:1:0": [0, 0, 265, 0, 0, 0, 0, 0, 265, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "268:1:0": [0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "269:1:0": [0, 0, 5, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "270:1:0": [5, 0, 5, 0, 5, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "271:1:0": [5, 0, 5, 0, 0, 0, 5, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "272:1:0": [0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "273:1:0": [0, 0, 4, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "274:1:0": [4, 0, 4, 0, 4, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "275:1:0": [4, 0, 4, 0, 0, 0, 4, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "276:1:0": [0, 0, 264, 0,
        0, 0, 0, 0, 264, 0, 0, 0, 0, 0, 280, 0, 0, 0
    ],
    "277:1:0": [0, 0, 264, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "278:1:0": [264, 0, 264, 0, 264, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "279:1:0": [264, 0, 264, 0, 0, 0, 264, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "280:4:0": [5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "281:4:0": [5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "282:1:0": [39, 0, 40, 0, 0, 0, 0, 0, 281, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "283:1:0": [0, 0, 266, 0, 0, 0, 0, 0, 266, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "284:1:0": [0, 0, 266, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "285:1:0": [266, 0, 266, 0, 266, 0, 0, 0, 280, 0, 0, 0,
        0, 0, 280, 0, 0, 0
    ],
    "286:1:0": [266, 0, 266, 0, 0, 0, 266, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "290:1:0": [5, 0, 5, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "291:1:0": [4, 0, 4, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "292:1:0": [265, 0, 265, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "293:1:0": [264, 0, 264, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "294:1:0": [266, 0, 266, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, 280, 0, 0, 0],
    "296:9:0": [170, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "297:1:0": [296, 0, 296, 0, 296, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "298:1:0": [334, 0, 334, 0, 334, 0, 334, 0, 0, 0, 334, 0, 0, 0, 0, 0,
        0, 0
    ],
    "299:1:0": [334, 0, 0, 0, 334, 0, 334, 0, 334, 0, 334, 0, 334, 0, 334, 0, 334, 0],
    "300:1:0": [334, 0, 334, 0, 334, 0, 334, 0, 0, 0, 265, 0, 334, 0, 0, 0, 334, 0],
    "301:1:0": [334, 0, 0, 0, 334, 0, 334, 0, 0, 0, 334, 0, 0, 0, 0, 0, 0, 0],
    "306:1:0": [265, 0, 265, 0, 265, 0, 265, 0, 0, 0, 265, 0, 0, 0, 0, 0, 0, 0],
    "307:1:0": [265, 0, 0, 0, 265, 0, 265, 0, 265, 0, 265, 0, 265, 0, 265, 0, 265, 0],
    "308:1:0": [265, 0, 265, 0, 265, 0, 265, 0, 0, 0, 265, 0, 265, 0, 0, 0, 265, 0],
    "309:1:0": [265, 0, 0, 0, 265, 0, 265, 0, 0, 0, 265, 0, 0, 0, 0, 0, 0, 0],
    "310:1:0": [264, 0, 264, 0, 264, 0, 264, 0, 0, 0, 264, 0, 0, 0, 0, 0, 0, 0],
    "311:1:0": [264, 0,
        0, 0, 264, 0, 264, 0, 264, 0, 264, 0, 264, 0, 264, 0, 264, 0
    ],
    "312:1:0": [264, 0, 264, 0, 264, 0, 264, 0, 0, 0, 264, 0, 264, 0, 0, 0, 264, 0],
    "313:1:0": [264, 0, 0, 0, 264, 0, 264, 0, 0, 0, 264, 0, 0, 0, 0, 0, 0, 0],
    "314:1:0": [266, 0, 266, 0, 266, 0, 266, 0, 0, 0, 266, 0, 0, 0, 0, 0, 0, 0],
    "315:1:0": [266, 0, 0, 0, 266, 0, 266, 0, 266, 0, 266, 0, 266, 0, 266, 0, 266, 0],
    "316:1:0": [266, 0, 266, 0, 266, 0, 266, 0, 0, 0, 266, 0, 266, 0, 0, 0, 266, 0],
    "317:1:0": [266, 0, 0, 0, 266, 0, 266, 0, 0, 0, 266, 0, 0, 0, 0, 0, 0, 0],
    "321:1:0": [280, 0, 280, 0, 280, 0, 280, 0, 35, 0, 280, 0, 280, 0, 280, 0, 280, 0],
    "323:3:0": [5, 0, 5, 0, 5, 0, 5, 0, 5, 0,
        5, 0, 0, 0, 280, 0, 0, 0
    ],
    "324:1:0": [5, 0, 5, 0, 0, 0, 5, 0, 5, 0, 0, 0, 5, 0, 5, 0, 0, 0],
    "325:1:0": [265, 0, 0, 0, 265, 0, 0, 0, 265, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "328:1:0": [265, 0, 0, 0, 265, 0, 265, 0, 265, 0, 265, 0, 0, 0, 0, 0, 0, 0],
    "339:3:0": [338, 0, 338, 0, 338, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "340:1:0": [0, 0, 339, 0, 0, 0, 0, 0, 339, 0, 0, 0, 0, 0, 339, 0, 0, 0],
    "345:1:0": [0, 0, 265, 0, 0, 0, 265, 0, 331, 0, 265, 0, 0, 0, 265, 0, 0, 0],
    "347:1:0": [0, 0, 266, 0, 0, 0, 266, 0, 331, 0, 266, 0, 0, 0, 266, 0, 0, 0],
    "351:9:4": [22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:1:11": [37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:1": [244, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:1:1": [38, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:3:15": [352, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:9": [351, 1, 351, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:14": [351, 1, 351, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:10": [351, 2, 351, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:8": [351, 0, 351, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:7": [351, 8, 351, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:7": [351, 0, 351, 15, 0, 0, 0, 0, 351, 15, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:3": [351, 0, 351, 14, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "351:2:3": [351, 0, 351, 1, 0, 0, 0, 0, 351, 11, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:12": [351, 4, 351, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:6": [351, 4, 351, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:5": [351, 4, 351, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:13": [351, 5, 351, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:13": [351, 4, 351, 1, 0, 0, 0, 0, 351, 9, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:13": [351, 4, 351, 15, 0, 0, 351, 1, 351, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:1:12": [38, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:1:13": [38, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0
    ],
    "351:1:7": [38, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:1:1": [38, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:1:14": [38, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:1:7": [38, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:1:9": [38, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:1:7": [38, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:11": [175, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:13": [175, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:1": [175, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "351:2:9": [175, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "353:1:0": [338,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "354:1:0": [325, 1, 325, 1, 325, 1, 353, 0, 344, 0, 353, 0, 296, 0, 296, 0, 296, 0],
    "355:1:0": [35, 0, 35, 0, 35, 0, 5, 0, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0],
    "357:8:0": [296, 0, 351, 3, 296, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "359:1:0": [0, 0, 265, 0, 0, 0, 265, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "361:4:0": [86, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "362:1:0": [360, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "388:9:0": [133, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "400:1:0": [86, 0, 353, 0, 0, 0, 344, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "459:1:0": [457, 0, 457, 0, 457, 0, 457, 0, 457, 0,
        457, 0, 0, 0, 281, 0, 0, 0
    ]
};

function MachineLiquidBlender() {
    this.parent = MachineBase;
    this.parent();
    this.id = 230;
    this.updateMachine = function(a) {
        if (0 == Level.getTime() % 20) {
            var c = this.find2Barrels(a);
            if (c) {
                var d = this.getBlendId(c[0], c[1]); - 1 != d && (a = getChest(a.x, a.y + 1, a.z), a.exist && (d = this.getDropByBlendId(d), c[0].volume--, c[1].volume--, !(.5 > Math.random()) && 0 < a.addItem(d[0], d[1], d[2]) && (c[0].volume++, c[1].volume++)))
            }
        }
    };
    this.getBlendId = function(a, c) {
        var d = a.liquid,
            e = c.liquid;
        if (!d || !e || d == e) return -1;
        if (8 == e && 10 == d || 10 == e && 8 == d) return 0;
        if (8 == e && 1 == d || 1 == e && 8 == d) return 1;
        if (1 == e && 10 == d || 10 == e && 1 == d) return 2
    };
    this.find2Barrels = function(a) {
        for (var c = parseInt(4 * Math.random()), d = [], e = 0; 4 > e; e++) {
            var f = (parseInt(e) + c) % 4,
                g = a.x + 1,
                h = a.z;
            1 == f && (g = a.x, h = a.z + 1);
            2 == f && (g = a.x - 1, h = a.z);
            3 == f && (g = a.x, h = a.z - 1);
            if (208 == getTile(g, a.y, h) && ((f = getMachine(g, a.y, h)) && d.push(f), 1 < d.length)) break
        }
        if (1 < d.length) return d
    };
    this.getDropByBlendId = function(a) {
        var c = 2 * Math.random() + a;
        return .04 > c ? [264, 1, 0] : .12 > c ? [495, 1, 0] : .24 > c ? [318, 1, 0] : 2 > c && 0 == a ? [49, 1, 0] : 2.8 > c &&
            0 == a ? [4, 1, 0] : 1.5 > c && 1 == a ? [353, 1, 0] : 2 > c && 1 == a ? [351, 1, 7] : 2.8 > c ? [351, 1, 15] : 3.4 > c ? [289, 1, 0] : [4, 1, 0]
    }
}

function MachineBlockBreaker() {
    this.parent = MachineBase;
    this.parent();
    this.id = 231;
    this.updateMachine = function(a) {
        if (0 == Level.getTime() % 20) {
            var c = getChest(a.x, a.y + 1, a.z);
            if (c.exist) {
                var d = getTile(a.x, a.y - 1, a.z),
                    e = Level.getData(a.x, a.y - 1, a.z);
                isBlockBreakable(d) && (d = getBlockDestroyDrop(d, e), c.addItem(d[0], d[1], d[2]) || Level.destroyBlock(a.x, a.y - 1, a.z))
            }
        }
    }
}

function MachineHeater() {
    this.parent = MachineBase;
    this.parent();
    this.id = 232;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 1E4
    };
    this.getMachineName = function() {
        return "heater"
    };
    this.wrenchClick = function(a) {
        ModPE.showTipMessage("temp: " + a.heat + "C")
    };
    this.getInfo = function(a) {
        return "temp: " + a.heat + "°"
    };
    this.updateMachine = function(a) {
        a.heat || (a.heat = 0);
        1E3 < a.heat && (a.heat = 1E3);
        6 <= this.getEnergyStored(a) && 1E3 > a.heat && (a.energyStored -= 6, a.heat++);
        0 < a.heat && 0 == Level.getTime() %
            8 && a.heat--;
        if (1E3 == a.heat) {
            var c = getChest(a.x, a.y + 1, a.z);
            if (c.exist) {
                var d = this.getBarrelToPlaceLiquid(a, 10);
                if (d) {
                    var e = c.getItem(4, 1, 0);
                    e.count || (e = c.getItem(1, 1, -1));
                    e.count && (d.liquid = 10, d.volume++, a.heat -= 500)
                }
            }
        }
    };
    this.getBarrelToPlaceLiquid = function(a, c) {
        for (var d = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1]
            ], e = 0, f = parseInt(4 * Math.random()); 4 > e;) {
            var g = d[(e + f) % 4];
            e++;
            var h = a.x + g[0],
                g = a.z + g[1];
            if (208 == getTile(h, a.y, g) && (h = getMachine(h, a.y, g), 16 > h.volume && (h.liquid == c || 0 == h.liquid))) return h
        }
    };
    this.isUsable = function(a) {
        return 1 ==
            a || 4 == a
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "hheat", c.heat)
    };
    this.read = function(a, c) {
        c.heat = DataSaver.ReadNumber(a + "hheat")
    }
}

function MachineNuclearBomb() {
    this.parent = MachineBase;
    this.parent();
    this.id = 233;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 100
    };
    this.getMachineName = function() {
        return "nuke"
    };
    this.updateMachine = function(a) {
        if (!(100 > this.getEnergyStored(a))) {
            a.timer || (a.timer = 600);
            if (1 == a.timer)
                if (this.isKeepingLoaded(a)) this.explode(a);
                else {
                    ModPE.showTipMessage(ChatColor.RED + "keep chunks around nuke loaded!");
                    return
                } else a.timer--;
            ModPE.showTipMessage(ChatColor.YELLOW + "explosion in " +
                parseInt(a.timer / 20) + "s")
        }
    };
    this.explode = function(a) {
        a.energyStored = 0;
        a.timer = 0;
        print("exploding... wait a second");
        for (var c = -40; 40 >= c; c++)
            for (var d = -40; 40 >= d; d++) {
                var e = Math.sqrt(c * c + d * d);
                if (!(40 < e))
                    for (var e = 15 * (1 - e / 40 * e / 40), f = -e; f <= 1.5 * e; f++) {
                        var g = 0;
                        4 > a.y + f && (g = getTile(a.x + c, a.y + f, a.z + d));
                        var h = 0;.25 > Math.random() && (h = 51);
                        7 != g && setTile(a.x + c, a.y + f, a.z + d, h);
                        g == this.id && this.explode(new Coords(a.x + c, a.y + f, a.z + d))
                    }
            }
        EntityHashData[1024] = [getPlayerEnt()];
        for (var k in EntityHashData)
            for (var l in EntityHashData[k]) c =
                EntityHashData[k][l], d = Entity.getX(c) - a.x, e = Entity.getZ(c) - a.z, 50 < Math.sqrt(d * d + e * e) || (Entity.setVelY(c, 2), Entity.setFireTicks(c, 999));
        EntityHashData[1024] = [];
        PlaySoundFile("Tools/NukeExplosion.ogg")
    };
    this.isKeepingLoaded = function(a) {
        for (var c = -3; 4 > c; c++)
            for (var d = -3; 4 > d; d++) {
                var e = 16 * parseInt(a.x / 16 + c) + 8,
                    f = 16 * parseInt(a.z / 16 + d) + 8;
                if (0 == getTile(e, 0, f)) return !1
            }
        return !0
    }
}

function MachineRubberTreeHarvester() {
    this.parent = MachineBase;
    this.parent();
    this.id = 234;
    this.updateMachine = function(a) {
        a.hasSapling ? this.tickSapling(a) : 0 == Level.getTime() % 100 && this.treeTick(a)
    };
    this.treeTick = function(a) {
        if (1 > 90 * Math.random()) {
            for (var c = 0; 192 == getTile(a.x, a.y + 1 + c, a.z);) c++;
            if (0 == c) return setTile(a.x, a.y + 1 + parseInt(Math.random() * c), a.z, 194)
        }
    };
    this.saplingClick = function(a) {
        if (a.hasSapling) ModPE.showTipMessage("here is another sapling");
        else {
            var c = Player.getCarriedItemCount(),
                d = getCarriedItem();
            2 > c && (d = 0);
            c--;
            Entity.setCarriedItem(getPlayerEnt(), d, c, 0);
            a.hasSapling = !0;
            a.saplingProgress = 0;
            ModPE.showTipMessage("sapling planted")
        }
    };
    this.tickSapling = function(a) {
        a.saplingProgress || (a.saplingProgress = 0);
        1 > 2 * Math.random() && (a.saplingProgress += 2E-4);
        1 < a.saplingProgress && (a.saplingProgress = 0, a.hasSapling = !1, genRubberTree(a.x, a.y + 1, a.z))
    };
    this.canGrow = function(a) {
        return 0 == getTile(a.x, a.y + 1, a.z)
    };
    this.getMachineName = function() {
        return "rubber tree harvester"
    };
    this.wrenchClick = function(a) {
        a.hasSapling ?
            ModPE.showTipMessage("growth progress " + parseInt(100 * a.saplingProgress) + "%") : ModPE.showTipMessage("no sapling")
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "hs", c.hasSapling);
        DataSaver.Save(a + "sp", c.saplingProgress)
    };
    this.read = function(a, c) {
        c.hasSapling = DataSaver.ReadBool(a + "hs");
        c.saplingProgress = DataSaver.ReadFloat(a + "sp")
    }
}
ModPE.setItem(470, "flower_pot", 0, "usual drone");
ModPE.setItem(471, "skull_wither", 0, "usual queen", 1);
Item.setMaxDamage(471, 1E3);
ModPE.setItem(472, "brewing_stand", 0, "honey comb", 1);
ModPE.setItem(468, "gold_nugget", 0, "honey frame", 1);

function CreateBeeRender(a, c) {
    model = a.getModel();
    model.getPart("head").clear();
    model.getPart("body").clear();
    model.getPart("rightArm").clear();
    model.getPart("leftArm").clear();
    model.getPart("rightLeg").clear();
    model.getPart("leftLeg").clear();
    bipedBody = model.getPart("head");
    bipedBody.setTextureOffset(0, 0);
    bipedBody.addBox(-1.5, 22.5, -3, 3, 2, 7);
    bipedBody.setTextureOffset(25, 25);
    bipedBody.addBox(-2.5, 22.5, -1, 1, 1, 3);
    bipedBody.addBox(-3.5, 21.5, -1, 1, 1, 3);
    bipedBody.addBox(-4.5, 20.5, -1, 1, 1, 3);
    bipedBody.addBox(1.5,
        22.5, -1, 1, 1, 3);
    bipedBody.addBox(2.5, 21.5, -1, 1, 1, 3);
    bipedBody.addBox(3.5, 20.5, -1, 1, 1, 3);
    bipedBody.setTextureOffset(16, 16);
    bipedBody.addBox(1.5, 21.5, -3, 1, 1, 1);
    bipedBody.addBox(2.5, 20.5, -4, 1, 1, 1);
    bipedBody.addBox(-2.5, 21.5, -3, 1, 1, 1);
    bipedBody.addBox(-3.5, 20.5, -4, 1, 1, 1);
    bipedBody.addBox(-1.5, 24.5, 3, 1, 1, 1);
    bipedBody.addBox(.5, 24.5, 3, 1, 1, 1);
    bipedBody.addBox(-1.5, 24.5, -2, 1, 1, 1);
    bipedBody.addBox(.5, 24.5, -2, 1, 1, 1);
    bipedBody.addBox(-1.5, 24.5, 1, 1, 1, 1);
    bipedBody.addBox(.5, 24.5, 1, 1, 1, 1)
}
var beeRenderer = Renderer.createHumanoidRenderer();
CreateBeeRender(beeRenderer);

function MachineWildBeeHive() {
    this.parent = MachineBase;
    this.parent();
    this.id = 236;
    this.updateMachine = function(a) {
        a.beeEntities || (a.beeEntities = []);
        var c = Level.getTime();
        0 == c % 20 && this.checkEntities(a);
        10 == c % 20 && this.addMissedEntities(a);
        1 == c % 30 && this.moveBees(a, 0);
        16 == c % 30 && this.moveBees(a, 1);
        this.holdEntityY(a)
    };
    this.checkEntities = function(a) {
        for (var c in a.beeEntities) 0 == Entity.getY(a.beeEntities[c]) && (a.beeEntities.splice(c, 1), c--)
    };
    this.addMissedEntities = function(a) {
        if (2 > a.beeEntities.length) {
            var c =
                Level.spawnMob(a.x + .5, a.y + .5, a.z + 1.5, 37);
            Entity.setMobSkin(c, "mob/bee.png");
            a.beeEntities.push(c);
            Entity.setRenderType(c, beeRenderer.renderType)
        }
    };
    this.moveBees = function(a, c) {
        a.moveData || (a.moveData = [{
            x: 0,
            y: 0,
            z: 0,
            rot: 0,
            rotAdd: 0
        }, {
            x: 0,
            y: 0,
            z: 0,
            rot: 0,
            rotAdd: 0
        }]);
        for (var d in a.beeEntities)
            if (c != c || d == c) {
                var e = a.beeEntities[d],
                    f = Entity.getX(e),
                    g = Entity.getY(e),
                    e = Entity.getZ(e),
                    h = a.x - .5 + 2 * Math.random(),
                    k = a.y + Math.random() + 1,
                    l = a.z + 2 * Math.random() - .5,
                    f = h - f,
                    g = k - g,
                    e = l - e,
                    l = Math.sqrt(f * f + g * g + e * e),
                    f = .04 / l * f,
                    g = .04 / l * g,
                    e = .04 / l * e;
                a.moveData[d].x = f;
                a.moveData[d].y = g;
                a.moveData[d].z = e;
                a.moveData[d].rot = 360 * Math.random();.5 > Math.random() ? a.moveData[d].rotAdd = 3 : a.moveData[d].rotAdd = -3
            }
    };
    this.holdEntityY = function(a) {
        for (var c in a.beeEntities) a.moveData ? (setVelX(a.beeEntities[c], a.moveData[c].x), setVelY(a.beeEntities[c], a.moveData[c].y), setVelZ(a.beeEntities[c], a.moveData[c].z), Entity.setRot(a.beeEntities[c], a.moveData[c].rot, 0)) : setVelY(a.beeEntities[c], 0)
    };
    this.onDestroy = function(a) {
        for (var c in a.beeEntities) {
            var d =
                470;
            0 == c && (d = 471);
            var e = a.beeEntities[c];
            Level.dropItem(Entity.getX(e), Entity.getY(e), Entity.getZ(e), 0, d, 1, 0);
            Entity.remove(a.beeEntities[c])
        }
    };
    this.getMachineName = function() {
        return "wild bee hive"
    }
}

function MachineBeeHive() {
    this.parent = MachineBase;
    this.parent();
    this.id = 237;
    this.getContainerId = function() {
        return 4
    };
    this.updateMachine = function(a) {
        try {
            var c = Level.getTime();
            0 == c % 10 && this.searchFlower(a);
            a.hasBees && a.flower && this.updateBees(a);
            15 == c % 40 && this.provideChest(a);
            this.getContainer(a).setProgressBar(a.honey / 200)
        } catch (d) {
            ModPE.showTipMessage(ChatColor.RED + "error in bee hive. It will be enabled in few seconds."), clientMessage(d.message)
        }
    };
    this.searchFlower = function(a) {
        if (0 < a.flCooldown) a.flCooldown--;
        else {
            a.flCooldown || (a.flCooldown = 0);
            var c = a.x - 4 + parseInt(9 * Math.random()),
                d = a.y - 1 + parseInt(3 * Math.random()),
                e = a.z - 4 + parseInt(9 * Math.random()),
                f = getTile(c, d, e);
            this.isFlower(f) && this.canWork(a) ? (a.flower = {
                x: c,
                y: d,
                z: e
            }, a.flCooldown = 25) : a.flower = {
                x: a.x,
                y: a.y + 1,
                z: a.z
            }
        }
    };
    this.isFlower = function(a, c) {
        return 37 == a || 38 == a || 175 == a
    };
    this.wrenchClick = function(a) {
        ModPE.showTipMessage("honey: " + parseInt(a.honey / 2) + "%")
    };
    this.getInfo = function(a) {
        return "honey: " + parseInt(a.honey / 2) + "%"
    };
    this.getMachineName = function() {
        return "bee hive"
    };
    this.provideChest = function(a) {
        a.honey || (a.honey = 0);
        var c = 0,
            d = this.getContainer(a),
            e = 471 == d.getSlot(1).id;
        470 == d.getSlot(0).id && (c = d.getSlot(0).count);
        a.hasBees = e && 0 < c;
        if (this.canWork(a)) {
            if (.7 > Math.random() && (d = d.getSlot(1), d.data++, 999 < d.data)) this.onQueenReborn(a);
            if (a.flower.x != a.x || a.flower.z != a.z) a.honey += c / 6 + .3;
            199 < a.honey && (this.putHoneyOnFrame(a) ? a.honey = 0 : a.honey = 199)
        } else if (a.beeEntities || (a.beeEntities = []), !a.hasBees) this.onDestroy(a)
    };
    this.canWork = function(a) {
        return a.hasBees && a.flower &&
            14 < Level.getBrightness(a.x, a.y + 1, a.z)
    };
    this.updateBees = function(a) {
        a.beeEntities || (a.beeEntities = []);
        var c = Level.getTime();
        0 == c % 20 && this.checkEntities(a);
        10 == c % 20 && this.canWork(a) && this.addMissedEntities(a);
        this.holdEntityY(a);
        0 == c % 30 && this.moveBees(a, 0);
        15 == c % 30 && this.moveBees(a, 1)
    };
    this.checkEntities = function(a) {
        for (var c in a.beeEntities) 0 == Entity.getY(a.beeEntities[c]) && (a.beeEntities.splice(c, 1), c--)
    };
    this.addMissedEntities = function(a) {
        if (1 > a.beeEntities.length) {
            var c = Level.spawnMob(a.x + .5, a.y +
                .5, a.z + .5, 37);
            Entity.setMobSkin(c, "mob/bee.png");
            a.beeEntities.push(c);
            Entity.setRenderType(c, beeRenderer.renderType)
        }
    };
    this.moveBees = function(a, c) {
        var d = a.flower.x == a.x && a.flower.z == a.z;
        a.moveData || (a.moveData = [{
            x: 0,
            y: 0,
            z: 0,
            rot: 0,
            rotAdd: 0
        }, {
            x: 0,
            y: 0,
            z: 0,
            rot: 0,
            rotAdd: 0
        }]);
        for (var e in a.beeEntities)
            if (c != c || e == c) {
                var f = a.beeEntities[e],
                    g = Entity.getX(f),
                    h = Entity.getY(f),
                    k = Entity.getZ(f),
                    l = a.flower.x + .5 * Math.random() + .25,
                    m = a.flower.y + Math.random() + .5,
                    n = a.flower.z + .5 * Math.random() + .25;
                d && (l = a.x + .5, n =
                    a.z + 1, m = a.y + .5);
                g = l - g;
                h = m - h;
                k = n - k;
                n = Math.sqrt(g * g + h * h + k * k);
                g *= .02 / n;
                h *= .02 / n;
                k *= .02 / n;
                1.5 > n && d ? Entity.remove(f) : (a.moveData[e].x = g, a.moveData[e].y = h, a.moveData[e].z = k, a.moveData[e].rot = 360 * Math.random(), .5 > Math.random() ? a.moveData[e].rotAdd = 3 : a.moveData[e].rotAdd = -3)
            }
    };
    this.holdEntityY = function(a) {
        for (var c in a.beeEntities) a.moveData ? (setVelX(a.beeEntities[c], a.moveData[c].x), setVelY(a.beeEntities[c], a.moveData[c].y), setVelZ(a.beeEntities[c], a.moveData[c].z), Entity.setRot(a.beeEntities[c], a.moveData[c].rot,
            0)) : setVelY(a.beeEntities[c], 0)
    };
    this.putHoneyOnFrame = function(a) {
        a = this.getContainer(a);
        for (var c = 2; 9 > c; c++) {
            var d = a.getSlot(c);
            if (468 == d.id) return d.id = 472, !0
        }
        return !1
    };
    this.onQueenReborn = function(a) {
        a = this.getContainer(a);
        var c = a.getSlot(1);
        471 == c.id && (c.data = 1);
        for (c = 2; 9 > c; c++) {
            var d = a.getSlot(c);
            if (0 == d.id || 470 == d.id) {
                d.id = 470;
                d.count++;
                break
            }
        }
    };
    this.onDestroy = function(a) {
        for (var c in a.beeEntities) Entity.remove(a.beeEntities[c]);
        a.beeEntities = []
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "honey",
            c.honey)
    };
    this.read = function(a, c) {
        c.honey = DataSaver.ReadFloat(a + "honey")
    }
}

function MachineCentrefuge() {
    this.parent = MachineBase;
    this.parent();
    this.id = 238;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMachineName = function() {
        return "centrefuge"
    };
    this.getMaxEnergyStored = function() {
        return 2E3
    };
    this.getContainerId = function() {
        return 2
    };
    this.wrenchClick = function(a) {
        var c = 3 * Math.pow(3, a.overclockers),
            d = "";
        a.progress && (d = ChatColor.GREEN + "progress " + parseInt(a.progress / 4) + "%");
        c > this.getEnergyStored(a) && a.progress && (d = ChatColor.RED + "no energy");
        d && ModPE.showTipMessage(d)
    };
    this.updateMachine =
        function(a) {
            this.showProgress(a);
            a.overclockers || (a.overclockers = 0);
            if (0 < a.progress) {
                var c = 3 * Math.pow(3, a.overclockers),
                    d = Math.pow(2, a.overclockers);
                if (this.getEnergyStored(a) < c) return;
                400 > a.progress && (a.energyStored -= c, a.progress += d);
                400 <= a.progress && this.provideRecipe(a) && (a.progress = 0)
            }
            0 == (Level.getTime() + 1551 * a.x + 578 * a.z) % 40 && (a.progress || (a.progress = 0), this.checkHasMaterial(a) ? (1 > a.progress && (a.progress = 1), a.overclockers = this.getUpgrades(a)) : a.progress = 0)
        };
    this.checkHasMaterial = function(a) {
        var c =
            this.getContainer(a).getSlot(0).id;
        a = this.getContainer(a).getSlot(1).id;
        return 472 == c && 475 == a
    };
    this.provideRecipe = function(a) {
        var c = this.getContainer(a);
        a = c.getSlot(0);
        c = c.getSlot(1);
        if (472 == a.id && 475 == c.id) return c.id = 473, a.count--, 0 == a.count && (a.id = 468, a.count = 1), !0
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "prs", c.progress)
    };
    this.read = function(a, c) {
        c.progress = DataSaver.ReadNumber(a + "prs")
    };
    this.getUpgrades = function(a) {
        a = this.getContainer(a).getSlot(2);
        return 506 == a.id ? a.count : 0
    };
    this.showProgress =
        function(a) {
            this.getContainer(a).setProgressBar(a.progress / 400)
        }
}

function MachineExtractor() {
    this.parent = MachineBase;
    this.parent();
    this.id = 239;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMachineName = function() {
        return "extractor"
    };
    this.getMaxEnergyStored = function() {
        return 2E3
    };
    this.getContainerId = function() {
        return 2
    };
    this.wrenchClick = function(a) {
        var c = 3 * Math.pow(3, a.overclockers),
            d = "";
        a.progress && (d = ChatColor.GREEN + "progress " + parseInt(a.progress / 4) + "%");
        c > this.getEnergyStored(a) && a.progress && (d = ChatColor.RED + "no energy");
        d && ModPE.showTipMessage(d)
    };
    this.updateMachine =
        function(a) {
            this.showProgress(a);
            2 == a.progress && this.playSound(a, "Machines/ExtractorOp.ogg");
            a.overclockers || (a.overclockers = 0);
            if (0 < a.progress) {
                var c = 3 * Math.pow(3, a.overclockers),
                    d = Math.pow(2, a.overclockers);
                if (this.getEnergyStored(a) < c) return;
                400 > a.progress && (a.energyStored -= c, a.progress += d);
                400 <= a.progress && this.provideRecipe(a) && (a.progress = 0)
            }
            0 == (Level.getTime() + 1551 * a.x + 578 * a.z) % 40 && (a.progress || (a.progress = 0), this.checkHasMaterial(a) ? (1 > a.progress && (a.progress = 1), a.overclockers = this.getUpgrades(a)) :
                (0 < a.progress && this.playSound(a, "Machines/InterruptOne.ogg"), a.progress = 0))
        };
    this.checkHasMaterial = function(a) {
        return 485 == this.getContainer(a).getSlot(0).id
    };
    this.provideRecipe = function(a) {
        var c = this.getContainer(a);
        a = c.getSlot(0);
        c = c.getSlot(1);
        if (485 == a.id && (0 == c.id || 488 == c.id) && 62 > c.count) return c.id = 488, c.count += 3, a.count--, 0 == a.count && (a.id = 0), !0
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "prs", c.progress)
    };
    this.read = function(a, c) {
        c.progress = DataSaver.ReadNumber(a + "prs")
    };
    this.getUpgrades = function(a) {
        a =
            this.getContainer(a).getSlot(2);
        return 506 == a.id ? a.count : 0
    };
    this.showProgress = function(a) {
        this.getContainer(a).setProgressBar(a.progress / 400)
    }
}

function MachineTerraformer() {
    this.parent = MachineBase;
    this.parent();
    this.id = 240;
    this.modes = [ChatColor.WHITE + "flatting", ChatColor.YELLOW + "freezing", ChatColor.RED + "desertation", ChatColor.GREEN + "greening"];
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 1E4
    };
    this.updateMachine = function(a) {
        if (!a.rad || 1 > a.rad) a.rad = 1;
        a.prg || (a.prg = 0);
        a.prg >= 8 * a.rad && (a.prg = 0, a.rad++);
        a.cooldown || (a.cooldown = 0);
        if (0 < a.cooldown) a.cooldown--;
        else if (a.mode != a.mode && (a.mode = -1), -1 != a.mode) {
            var c =
                this.calcCoords(a);
            if (0 == Level.getTime() % 20) {
                var d = c[0],
                    c = c[1],
                    e = this.getTerrainY(d, a.y, c),
                    f = !1;
                0 == a.mode && (f = this.provideFlatting(a, d, e, c));
                1 == a.mode && (f = this.provideFreezing(a, d, e, c));
                2 == a.mode && (f = this.provideDesertation(a, d, e, c));
                3 == a.mode && (f = this.provideGreening(a, d, e, c));
                f && a.prg++
            }
        }
    };
    this.wrenchClick = function(a) {
        a.mode = (a.mode + 1) % 4;
        a.mode || (a.mode = 0);
        a.rad = 1;
        a.prg = 0;
        clientMessage("changed mode to " + ChatColor.BOLD + this.modes[a.mode])
    };
    this.checkChunk = function(a, c) {
        return 0 != getTile(16 * a + 8,
            0, 16 * c + 8)
    };
    this.calcCoords = function(a) {
        var c = parseInt(a.prg / a.rad / 2),
            d = a.prg % (2 * a.rad),
            e = 0,
            f = 0;
        0 == c && (e = d - a.rad + 1, f = a.rad);
        1 == c && (e = a.rad, f = -(d - a.rad + 1));
        2 == c && (e = -(d - a.rad + 1), f = -a.rad);
        3 == c && (e = -a.rad, f = d - a.rad + 1);
        return [a.x + e, a.z + f]
    };
    this.getTerrainY = function(a, c, d) {
        for (var e = isTerrainBlock(getTile(a, c, d)); e == isTerrainBlock(getTile(a, c, d)) && 0 < c;) e ? c++ : c--;
        e && c--;
        return c
    };
    this.provideFlatting = function(a, c, d, e) {
        if (300 > this.getEnergyStored(a)) return 0;
        a.energyStored -= 300;
        for (var f = [], g = 0; 4 > g; g++) {
            var h =
                getTile(c, d - g, e);
            if (isTerrainBlock(h)) f.push(h);
            else break
        }
        var h = a.y > d,
            k = Math.min(a.y, d);
        d = Math.max(a.y, d);
        for (h || d++; k < d; k++) h ? setTile(c, k, e, 1) : setTile(c, k, e, 0);
        a.cooldown = 3 * Math.abs(k - d) + 10;
        for (g in f) setTile(c, a.y - 1 - g, e, f[g]);
        return !0
    };
    this.provideFreezing = function(a, c, d, e) {
        if (50 > this.getEnergyStored(a)) return 0;
        a.energyStored -= 50;
        a.cooldown = 10;
        Level.setGrassColor(c, e, 8566165);
        a = getTile(c, d + 1, e);
        (0 == a || isPlantBlock(a)) && setTile(c, d + 1, e, 78);
        for (d++; 8 == a || 9 == a;) setTile(c, d, e, 79), d++, a = getTile(c,
            d, e);
        return !0
    };
    this.provideGreening = function(a, c, d, e) {
        if (50 > this.getEnergyStored(a)) return 0;
        a.energyStored -= 50;
        a.cooldown = 10;
        Level.setGrassColor(c, e, 6146362);
        for (var f = a = 0; 5 > f; f++) {
            var g = getTile(c, d - a, e);
            isTerrainBlock(g) && (0 == a ? setTile(c, d - a, e, 2) : setTile(c, d - a, e, 3));
            a++
        }
        a = getTile(c, d + 1, e);
        if (0 == a || 78 == a) setTile(c, d + 1, e, 31, 0), .1 > Math.random() && setTile(c, d + 1, e, 31, 1), .1 > Math.random() && setTile(c, d + 1, e, 38, parseInt(8 * Math.random()));
        return !0
    };
    this.provideDesertation = function(a, c, d, e) {
        if (50 > this.getEnergyStored(a)) return 0;
        a.energyStored -= 50;
        a.cooldown = 10;
        Level.setGrassColor(c, e, 11320144);
        for (var f = a = 0; 7 > f; f++) {
            var g = getTile(c, d - a, e);
            isTerrainBlock(g) && (4 > a ? setTile(c, d - a, e, 12) : setTile(c, d - a, e, 24));
            a++
        }
        for (a = 1;;)
            if (g = getTile(c, d + a, e), 8 == g || 9 == g) setTile(c, d + a, e, 0);
            else break;
        return !0
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "#mode", c.mode);
        DataSaver.Save(a + "#prg", c.prg);
        DataSaver.Save(a + "#rad", c.rad)
    };
    this.read = function(a, c) {
        c.mode = DataSaver.ReadNumber(a + "#mode");
        c.prg = DataSaver.ReadNumber(a + "#prg");
        c.rad = DataSaver.ReadNumber(a +
            "#rad")
    };
    this.getMachineName = function() {
        return "terraformer"
    };
    this.getInfo = function(a) {
        (a = this.modes[a.mode]) || (a = "none");
        a = a.substring(2, a.length);
        return "mode: " + a
    }
}

function isTerrainBlock(a) {
    return 1 == a || 2 == a || 3 == a || 12 == a || 13 == a || 14 == a || 15 == a || 16 == a || 56 == a || 24 == a || 82 == a
}

function isPlantBlock(a) {
    return 6 == a || 31 == a || 32 == a || 37 == a || 3 == a || 39 == a || 40 == a || 83 == a || 175 == a
}

function MachineBiomassFact() {
    this.parent = MachineBase;
    this.parent();
    this.id = 241;
    this.recipes = {
        6: 1 / 24,
        18: .03125,
        37: .0625,
        38: .0625,
        39: .0625,
        40: .0625,
        81: 1 / 12,
        86: 1 / 12,
        161: .03125,
        170: 1 / 2.99,
        175: .0625,
        295: .03125,
        296: 1 / 12,
        319: .0625,
        334: 1 / 12,
        338: .05,
        363: .0625,
        365: .0625,
        391: 1 / 24,
        392: 1 / 24,
        458: 1 / 12,
        459: .0625
    };
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 120
    };
    this.getContainerId = function() {
        return 3
    };
    this.updateMachine = function(a) {
        a.prg || (a.prg = 0);
        a.maxPrg || (a.maxPrg = 0);
        a.volume ||
            (a.volume = 0);
        var c = this.getContainer(a);
        c.setLiquidBar(a.volume / 16, 6);
        0 < a.maxPrg && 16 >= a.volume + a.maxPrg ? (5 > this.getEnergyStored(a) ? a.prg += 1 / 8192 : (a.prg += 1 / 1024, a.energyStored -= 5), c.setFireBar(1 - a.prg / a.maxPrg)) : c.setFireBar(0);
        a.maxPrg <= a.prg && (a.volume += a.maxPrg, a.prg = 0, a.maxPrg = 0);
        c = c.getSlot(0);
        if (0 == a.maxPrg && (0 == Level.getTime() % 40 || !a.hasCheck)) {
            a.hasCheck = !0;
            for (var d in this.recipes)
                if (c.id == d) {
                    a.maxPrg = this.recipes[d];
                    c.count--;
                    1 > c.count && (c.id = 0);
                    a.hasCheck = !1;
                    break
                }
        }
        325 == c.id && 0 == c.data &&
            1 <= a.volume && (c.id = 466, a.volume--);
        1 <= a.volume && 0 == Level.getTime() % 60 && 208 == getTile(a.x, a.y + 1, a.z) && (!(d = getMachine(a.x, a.y + 1, a.z)) || 0 != d.liquid && 6 != d.liquid || (d.liquid = 6, d.volume++, a.volume--))
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "prg", c.prg);
        DataSaver.Save(a + "mprg", c.maxPrg);
        DataSaver.Save(a + "vol", c.volume)
    };
    this.read = function(a, c) {
        c.prg = DataSaver.ReadFloat(a + "prg", c.prg);
        c.maxPrg = DataSaver.ReadFloat(a + "mprg");
        c.volume = DataSaver.ReadFloat(a + "vol")
    };
    this.getMachineName = function() {
        return "bioreactor"
    }
}

function MachineFuelFact() {
    this.parent = MachineBase;
    this.parent();
    this.id = 242;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMachineName = function() {
        return "fuel factory"
    };
    this.getMaxEnergyStored = function() {
        return 200
    };
    this.updateMachine = function(a) {
        a.receiverUpdated_ || (this.updateBarrelHash(a), a.receiverUpdated_ = !0);
        if (!(10 > this.getEnergyStored(a)) && 2 == a.barrelHash.length) {
            var c = a.barrelHash[0],
                d = a.barrelHash[1];
            4 != c.liquid || 5 != d.liquid && 0 != d.liquid || (0 >= c.volume ? c.volume = 0 : 16 <= d.volume ? d.volume = 16 :
                (c.volume -= 1 / 1024, d.volume += 1 / 1024, d.liquid = 5, a.energyStored -= 10))
        }
    };
    this.updateBarrelHash = function(a) {
        a.barrelHash = [];
        var c = [
                [a.x - 1, a.z],
                [a.x + 1, a.z],
                [a.x, a.z + 1],
                [a.x, a.z - 1]
            ],
            d;
        for (d in c)
            if (208 == getTile(c[d][0], a.y, c[d][1])) {
                var e = getMachine(c[d][0], a.y, c[d][1]);
                if (e && (a.barrelHash.push(e), 2 == a.barrelHash.length)) break
            }
        2 > a.barrelHash.length ? a.barrelHash = [] : 4 == a.barrelHash[1].liquid && (a.barrelHash = [a.barrelHash[1], a.barrelHash[0]])
    }
}

function MachineLiquidEngine() {
    this.parent = MachineBase;
    this.parent();
    this.id = 250;
    this.energyPerBucket = {
        10: 5E3,
        4: 5E3,
        5: 16E3,
        6: 1E4
    };
    this.liquidByBucket = {
        "325:1": 1,
        "325:8": 8,
        "325:10": 10,
        "464:-1": 4,
        "467:-1": 5,
        "466:-1": 6,
        "465:-1": 7
    };
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMachineName = function() {
        return "liquid fuel engine"
    };
    this.getMaxEnergyStored = function() {
        return 200
    };
    this.getContainerId = function() {
        return 3
    };
    this.isGenerator = function() {
        return !0
    };
    this.updateMachine = function(a) {
        var c = Level.getTime();
        a.liquid && a.volume && 0 != a.volume || (a.liquid = 0, a.volume = 0);
        0 == c % 8 && (this.getContainer(a).setFireBar(0), this.getContainer(a).setLiquidBar(a.volume / 16, a.liquid));
        if (0 == c % 20 && 15 >= a.volume) {
            var d = this.getContainer(a).getSlot(0),
                e = d.id + ":",
                e = 325 == d.id ? e + d.data : e + -1;
            !(e = this.liquidByBucket[e]) || e != a.liquid && 0 != a.liquid || (d.id = 325, d.data = 0, a.liquid = e, a.volume++);
            if (208 != getTile(a.x, a.y + 1, a.z)) return;
            (d = getMachine(a.x, a.y + 1, a.z)) && 0 != d.liquid && 1 <= d.volume && (d.liquid == a.liquid || 0 == a.liquid) && (a.liquid = d.liquid,
                d.volume--, a.volume++)
        }
        a.liquid && a.volume || (a.liquid = 0, a.volume = 0);
        0 != a.liquid && (200 <= this.getEnergyStored(a) ? a.energyStored = 200 : this.energyPerBucket[a.liquid] && (1 == c % 8 && this.getContainer(a).setFireBar(1), a.volume -= 1 / 1024, a.energyStored += this.energyPerBucket[a.liquid] / 1024, 0 > a.volume && (a.volume = 0, a.liquid = 0)))
    };
    this.getEnergyOutput = function(a) {
        var c = 0;
        0 == Level.getTime() % 5 && (c = a.energyStored, a.energyStored = 0);
        return c
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "liquid", c.liquid);
        DataSaver.Save(a + "vol",
            c.volume)
    };
    this.read = function(a, c) {
        c.liquid = DataSaver.ReadNumber(a + "liquid");
        c.volume = DataSaver.ReadFloat(a + "vol")
    }
}

function MachineReplicator() {
    this.parent = MachineBase;
    this.parent();
    this.id = 251;
    this.getContainerId = function() {
        return 0
    };
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMaxEnergyStored = function() {
        return 2E3
    };
    this.updateMachine = function(a) {
        a.progress || (a.progress = 0);
        var c = this.getContainer(a),
            d = c.getSlot(0),
            e = c.getSlot(1);
        c.setProgressBar(a.progress / 1024);
        if (0 == a.progress && 0 == Level.getTime() % 40 && 460 == d.id) {
            var c = getTile(a.x, a.y - 1, a.z),
                f = getMachine(a.x, a.y - 1, a.z);
            f && 208 == c && 7 == f.liquid && 1 <= f.volume &&
                (f.volume--, a.progress = 1, d.count--, 0 == d.count && (d.id = 0))
        }
        1024 <= a.progress ? (508 == e.id || 0 == e.id) && 64 > e.count && (a.progress = 0, e.id = 508, e.count++) : 0 < a.progress && 8 <= this.getEnergyStored(a) && (a.energyStored -= 8, a.progress++)
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "prs", c.progress)
    };
    this.read = function(a, c) {
        c.progress = DataSaver.ReadNumber(a + "prs")
    };
    this.getMachineName = function() {
        return "replicator"
    }
}

function MachineCompressor() {
    this.parent = MachineBase;
    this.parent();
    this.id = 253;
    this.isUsingEnergy = function() {
        return !0
    };
    this.getMachineName = function() {
        return "compressor"
    };
    this.getMaxEnergyStored = function() {
        return 2E3
    };
    this.getContainerId = function() {
        return 2
    };
    this.wrenchClick = function(a) {
        var c = 3 * Math.pow(3, a.overclockers),
            d = "";
        a.progress && (d = ChatColor.GREEN + "progress " + parseInt(a.progress / 4) + "%");
        c > this.getEnergyStored(a) && a.progress && (d = ChatColor.RED + "no energy");
        d && ModPE.showTipMessage(d)
    };
    this.updateMachine =
        function(a) {
            this.showProgress(a);
            2 == a.progress && this.playSound(a, "Machines/CompressorOp.ogg");
            a.overclockers || (a.overclockers = 0);
            if (0 < a.progress) {
                var c = 5 * Math.pow(3, a.overclockers),
                    d = Math.pow(2, a.overclockers);
                if (this.getEnergyStored(a) < c) return;
                400 > a.progress && (a.energyStored -= c, a.progress += d);
                400 <= a.progress && this.provideRecipe(a) && (a.progress = 0)
            }
            0 == (Level.getTime() + 1551 * a.x + 578 * a.z) % 40 && (a.progress || (a.progress = 0), this.checkHasMaterial(a) ? (1 > a.progress && (a.progress = 1), a.overclockers = this.getUpgrades(a)) :
                (0 < a.progress && this.playSound(a, "Machines/InterruptOne.ogg"), a.progress = 0))
        };
    this.checkHasMaterial = function(a) {
        var c = this.getContainer(a).getSlot(0).id;
        this.getContainer(a).getSlot(1);
        return 448 == c || 449 == c || 178 == c || 441 == c
    };
    this.recipes = {
        448: 450,
        449: 451,
        178: 446,
        441: 264
    };
    this.provideRecipe = function(a) {
        var c = this.getContainer(a);
        a = c.getSlot(0);
        var c = c.getSlot(1),
            d;
        for (d in this.recipes) {
            var e = this.recipes[d];
            if (a.id == d && (c.id == e || 0 == c.id) && 64 > c.count) return a.count--, 1 > a.count && (a.id = 0), c.count++, c.id =
                e, !0
        }
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "prs", c.progress)
    };
    this.read = function(a, c) {
        c.progress = DataSaver.ReadNumber(a + "prs")
    };
    this.getUpgrades = function(a) {
        a = this.getContainer(a).getSlot(2);
        return 506 == a.id ? a.count : 0
    };
    this.showProgress = function(a) {
        this.getContainer(a).setProgressBar(a.progress / 400)
    }
}

function MachineRubTreeSapling() {
    this.parent = MachineBase;
    this.parent();
    this.id = 254;
    this.onDestroy = function(a) {
        a.nodrop || Level.dropItem(a.x + .5, a.y + .5, a.z + .5, 0, 486, 1, 0)
    };
    this.canDeactivate = function() {
        return !1
    };
    this.updateMachine = function(a) {
        a.age || (a.age = 0);
        if (0 == Level.getTime() % 22) {
            var c = Level.getTile(a.x, a.y - 1, a.z);
            2 != c && 3 != c && 60 != c && Level.destroyBlock(a.x, a.y, a.z)
        }
        a.age += Math.random();
        6E3 < a.age && (genRubberTree(a.x, a.y, a.z, !1), setTile(a.x, a.y, a.z, 191), a.nodrop = !0, removeMachine(a.x, a.y, a.z), currentMachinePlace =
            a, a.age = 0);
        a.isActivated = !0
    };
    this.save = function(a, c) {
        DataSaver.Save(a + "age", c.age)
    };
    this.read = function(a, c) {
        c.age = DataSaver.ReadNumber(a + "age")
    };
    this.getInfo = function(a) {
        return "growing: " + parseInt(a.age / 60)
    }
}

function MachineRubTreeRoot() {
    this.parent = MachineBase;
    this.parent();
    this.id = 191;
    this.canDeactivate = function() {
        return !1
    };
    this.updateMachine = function(a) {
        a.isActivated = !0;
        if (1 > 90 * Math.random() && 0 == Level.getTime() % 75) {
            for (var c = 0;;) {
                var d = getTile(a.x, a.y + 1 + c, a.z);
                if (192 != d && 194 != d) break;
                c++
            }
            if (0 == c) return setTile(a.x, a.y + 1 + parseInt(Math.random() * c), a.z, 194)
        }
    }
}

function MachineTesseract() {
    this.parent = MachineBase;
    this.parent();
    this.id = 131;
    this.getContainerId = function() {
        return 3
    };
    this.updateMachine = function(a) {
        var c = this.getContainer(a).getSlot(0);
        if (!a.hadFirstTick) {
            var d = this.MachineCoords[0],
                e = this.getContainer(d).getSlot(0);
            c.id = e.id;
            c.count = e.count;
            c.data = e.data;
            a.volume = d.volume;
            a.liquid = d.liquid;
            a.hadFirstTick = !0
        }
        if (c.id != a.lastID || c.count != a.lastCount || c.data != a.lastData) {
            a.lastID = c.id;
            a.lastCount = c.count;
            a.lastData = c.data;
            for (var f in this.MachineCoords) d =
                this.MachineCoords[f], e = this.getContainer(d).getSlot(0), e.id = c.id, e.count = c.count, e.data = c.data
        }
        a.volume && a.liquid || (a.volume = a.liquid = 0);
        0 >= a.volume && (a.volume = a.liquid = 0);
        this.getContainer(a).setLiquidBar(a.volume / 16, a.liquid);
        0 == Level.getTime() % 20 && (c = getTile(a.x, a.y + 1, a.z), d = getMachine(a.x, a.y + 1, a.z), 208 == c && d && (1 <= d.volume && d.volume > a.volume && (d.liquid == a.liquid || 0 == a.liquid) && (a.liquid = d.liquid, a.volume++, d.volume--), 1 <= a.volume && d.volume < a.volume && (d.liquid == a.liquid || 0 == a.liquid) && (d.liquid =
            a.liquid, d.volume++, a.volume--)));
        if (a.lVol != a.volume || a.lLiq != a.liquid)
            for (f in a.lVol = a.volume, a.lLiq = a.liquid, this.MachineCoords) d = this.MachineCoords[f], d.volume = a.volume, d.liquid = a.liquid
    }
}

function addEnergyToSinglerMachine(a, c, d) {
    if (c) {
        var e = getMachineType(a);
        if (!e || !e.isUsingEnergy() || e.isGenerator() && !d) return c;
        e.getEnergyStored(a);
        if (a.disactive) return c;
        d = e.getMaxEnergyStored();
        e = Math.max(0, c - (d - a.energyStored));
        a.energyStored += c;
        a.energyStored > d && (a.energyStored = d);
        return e
    }
}

function addEnergyToMachineFast(a, c) {
    a.energyStored || (a.energyStored = 0);
    var d = a.web_maxStored,
        e = Math.max(0, c - (d - a.energyStored));
    a.energyStored += c;
    a.energyStored > d && (a.energyStored = d);
    return e
}

function DisconnectMachines(a, c) {
    a.energyWeb = [];
    c.energyWeb = [];
    for (var d in a.energyConnections) a.energyConnections[d] == c && (a.energyConnections.splice(d, 1), d--);
    for (d in c.energyConnections) c.energyConnections[d] == a && (c.energyConnections.splice(d, 1), d--)
}

function DisconnectAllFromMachine(a) {
    setUpConnectionValues(a);
    for (var c in a.energyConnections) DisconnectMachines(a, a.energyConnections[c])
}
var TYPE_WIRE = 215,
    TYPE_PIPE = 216,
    TYPE_MACHINE = 199,
    TYPE_RECIVER = 217,
    WireAndPipeData = [];

function saveWireAndPipeData() {
    var a = 0,
        c;
    for (c in WireAndPipeData) WireAndPipeData[c] && a++;
    DataSaver.Save("wpd#len", a);
    a = 0;
    for (c in WireAndPipeData) WireAndPipeData[c] && (DataSaver.Save("wpd#key_" + a, c), DataSaver.Save("wpd#val_" + a, WireAndPipeData[c]), a++)
}

function readWireAndPipeData() {
    WireAndPipeData = [];
    for (var a = DataSaver.ReadNumber("wpd#len"), c = 0; c < a; c++) {
        var d = DataSaver.ReadString("wpd#key_" + c),
            e = DataSaver.ReadNumber("wpd#val_" + c);
        e && (WireAndPipeData[d] = e)
    }
    clientMessage("wpd loaded " + a)
}
var connectionsShowed = 0;

function DisplayAllPathConnections(a) {
    if (a.wireConnections) {
        a.wireShowed = !0;
        for (var c in a.wireConnections) connectionsShowed++, Level.getTime() % 6 == connectionsShowed % 6 && displayPathConnection(a.wireConnections[c].path)
    }
}

function setUpConnectionValues() {}

function ArrayCopy(a) {
    var c = [],
        d;
    for (d in a) c[d] = a[d];
    return c
}

function anyInArray(a) {
    for (var c in a) return !0;
    return !1
}

function getPathDst(a) {
    if (!a.length) return null;
    a = a[a.length - 1];
    return getMachine(a.x, a.y, a.z)
}

function addToWireConnections(a, c) {
    a.wireConnections || (a.wireConnections = []);
    a.wireConnections.push({
        path: c,
        dst: getPathDst(c)
    })
}

function LogPath(a) {
    var c = "",
        d;
    for (d in a) c += "[" + a[d].x + "," + a[d].y + "," + a[d].z + "] - ";
    clientMessage(c)
}
var needRebuildWireConnections = !1,
    wpdCheckingCache = [];

function tickWireAndPipeData() {
    var a = 0,
        c = Level.getTime(),
        d;
    for (d in WireAndPipeData) WireAndPipeData[d] && (0 == (19 * a + c) % 50 && (checkWireAndPipeData(d, WireAndPipeData[d]) || wpdOnChange(d)), a++)
}

function checkWireAndPipeData(a, c) {
    var d = a.split(","),
        e = parseInt(d[0]),
        f = parseInt(d[1]),
        d = parseInt(d[2]),
        g = getTile(e, f, d);
    return c == TYPE_MACHINE ? getMachine(e, f, d) : g == c || 0 == getTile(e, 0, d)
}

function wpdOnChange(a, c) {
    var d = WireAndPipeData[a];
    WireAndPipeData[a] = 0;
    var e = a.split(","),
        f = parseInt(e[0]),
        g = parseInt(e[1]),
        e = parseInt(e[2]);
    animateCoords(5, f, g, e);
    d != TYPE_WIRE && d != TYPE_MACHINE || registerWireChange();
    d != TYPE_PIPE && d != TYPE_RECIVER || registerPipeChange();
    convertWpdToModelHash(WireAndPipeData)
}

function RebuildPipeConnections(a) {
    a.pipeConnections = [];
    BuildPipeConnections(a)
}

function BuildPipeConnections(a, c, d, e) {
    d || (d = []);
    e || (e = []);
    c || (c = a);
    var f = c.x + "," + c.y + "," + c.z;
    d[f] || (WireAndPipeData[f] != TYPE_RECIVER || a.x == c.x && a.y == c.y && a.z == c.z || !anyInArray(e) ? WireAndPipeData[f] != TYPE_PIPE && anyInArray(d) || (d[f] = !0, e.push(c), BuildPipeConnections(a, new Coords(c.x + 1, c.y, c.z), d, ArrayCopy(e)), BuildPipeConnections(a, new Coords(c.x - 1, c.y, c.z), d, ArrayCopy(e)), BuildPipeConnections(a, new Coords(c.x, c.y + 1, c.z), d, ArrayCopy(e)), BuildPipeConnections(a, new Coords(c.x, c.y - 1, c.z), d, ArrayCopy(e)),
        BuildPipeConnections(a, new Coords(c.x, c.y, c.z + 1), d, ArrayCopy(e)), BuildPipeConnections(a, new Coords(c.x, c.y, c.z - 1), d, ArrayCopy(e))) : (e.push(c), addToPipeConnections(a, e)))
}

function addToPipeConnections(a, c) {
    a.pipeConnections || (a.pipeConnections = []);
    a.pipeConnections.push({
        path: c,
        dst: c[c.length - 1]
    })
}

function DisplayAllPipeConnections(a) {
    if (a.pipeConnections)
        for (var c in a.pipeConnections) connectionsShowed++, displayPipeConnection(a.pipeConnections[c].path)
}

function displayPipeConnection(a) {
    if (!(2 > a.length))
        for (var c = a[0], d = 1; d < a.length; d++) {
            for (var e = 0; 5 > e; e++) animateEnergyWirePath(ParticleType.redstone, a[d], c, !0);
            c = a[d]
        }
}

function registerWireChange() {
    convertWpdToModelHash(WireAndPipeData);
    WebRebuildTimer = 15
}

function registerPipeChange() {
    convertWpdToModelHash(WireAndPipeData);
    for (var a in MachineDataByID) MachineDataByID[a].pipeUpdated_ = !1
}

function registerReceiverChange() {
    convertWpdToModelHash(WireAndPipeData);
    for (var a in MachineDataByID) MachineDataByID[a].receiverUpdated_ = !1
}

function EnergyWeb(a) {
    this.idMap = a;
    this.generators = [];
    this.machines = [];
    this.storageMap = [];
    this.energyLimit = this.energy = 0;
    this.add = function(a) {
        var d = getMachineType(a);
        d && d.isUsingEnergy() && (d.isGenerator() ? this.generators.push(a) : this.machines.push(a), this.storageMap[a.uniqueID] = d.getMaxEnergyStored(), this.idMap[a.uniqueID] = !0, a.webObj = this)
    };
    this.addEnergy = function(a, d) {
        this.energy += a;
        var e = this.energy - this.energyLimit;
        0 < e && (this.energy = this.energyLimit);
        return Math.max(0, e)
    };
    this.calcLimit = function(a) {
        this.energyLimit =
            0;
        for (var d in this.machines) {
            var e = this.machines[d];
            if (e.uniqueID == a) break;
            this.energyLimit += this.storageMap[e.uniqueID] - (e.energyStored || 0)
        }
    };
    this.transEnergy = function() {
        var a = this.machines.length;
        this.lastEnergy = this.energy;
        for (var d in this.machines) {
            var e = this.machines[d],
                f = e.energyStored || 0,
                g = f,
                f = Math.min(f + this.energy / a, this.storageMap[e.uniqueID]);
            this.energy -= f - g;
            a--;
            e.energyStored = f
        }
        this.calcLimit()
    };
    this.getEnergyStored = function(a) {
        return a.energyStored ? a.energyStored : 0
    }
}
var EnergyWebList = [];

function rebuildAllEnergyWebs() {
    EnergyWebList = [];
    var a = [],
        c;
    for (c in MachineDataByID)
        if (!a[c]) {
            var d = MachineDataByID[c];
            getMachineType(d).isUsingEnergy() && (d = BuildWeb(d, a)) && EnergyWebList.push(d)
        }
}
var WebRebuildTimer = -1;

function updateEnergyWebs() {
    0 == WebRebuildTimer && rebuildAllEnergyWebs(); - 1 < WebRebuildTimer && WebRebuildTimer--;
    for (var a in EnergyWebList) try {
        EnergyWebList[a].transEnergy()
    } catch (c) {
        clientMessage(c)
    }
}

function BuildWeb(a, c, d, e) {
    d || (d = []);
    e || (e = new EnergyWeb(c));
    var f = a.x + "," + a.y + "," + a.z;
    if (!d[f]) {
        var g = WireAndPipeData[f];
        if (g == TYPE_MACHINE) {
            var h = getMachine(a.x, a.y, a.z);
            h && e.add(h)
        }
        if (g == TYPE_WIRE || g == TYPE_MACHINE) return d[f] = !0, BuildWeb(new Coords(a.x + 1, a.y, a.z), c, d, e), BuildWeb(new Coords(a.x - 1, a.y, a.z), c, d, e), BuildWeb(new Coords(a.x, a.y + 1, a.z), c, d, e), BuildWeb(new Coords(a.x, a.y - 1, a.z), c, d, e), BuildWeb(new Coords(a.x, a.y, a.z + 1), c, d, e), BuildWeb(new Coords(a.x, a.y, a.z - 1), c, d, e), e
    }
}

function ArrayCopy(a) {
    var c = [],
        d;
    for (d in a) c[d] = a[d];
    return c
}
var LastMachineID = 0,
    MachineTypes, MachineTypesMap = [],
    MachineDataByID = [];

function isMachine(a) {
    for (var c in MachineTypes)
        if (MachineTypes[c].id == a) return !0
}

function resetMachineTypes() {
    LastMachineID = 0;
    MachineDataByID = [];
    WireAndPipeData = [];
    MachineTypesMap = [];
    MachineTypes = [new MachineRecycler, new MachineCropHarvester, new MachineQuarry, new MachineChestTransporter, new MachineMacerator, new MachineBeacon, new MachineDrill, new MachineBarrel, new MachineGenSolar, new MachineBatBox, new MachineFuelGen, new MachineNuclearReactor, new MachineElectricFurnace, new MachineMassFabricator, new MachineTeleporter, new MachineWatermill, new MachineWindmill, new MachineGenGeotermal,
        new MachinePump, new MachineAutoMilker, new MachineFiller, new MachineGrowthAccelerator, new MachineMobSlayer, new MachineMobFeeder, new MachineMonsterDefender, new MachineAssembler, new MachineLiquidBlender, new MachineBlockBreaker, new MachineHeater, new MachineNuclearBomb, new MachineRubberTreeHarvester, new MachineMFE, new MachineWildBeeHive, new MachineBeeHive, new MachineCentrefuge, new MachineExtractor, new MachineTerraformer, new MachineBiomassFact, new MachineFuelFact, new MachineLiquidEngine, new MachineReplicator,
        new MachineMFSU, new MachineCompressor, new MachineRubTreeRoot, new MachineRubTreeSapling, new MachineReceiver, new MachineReactorCell, new MachineTesseract
    ];
    FactAPI.resetCustomMachineTypes(MachineTypes)
}
var firstTickTime = -1;

function tickMachineTypes() {
    if (0 != getPlayerY() && !(10 > globalWorldTime)) {
        connectionsShowed = 0;
        showedConnectionsCoords = [];
        worldTimeIndexAdd = 0;
        tickWireAndPipeData();
        worldTimeIndexAdd = 0;
        for (var a in MachineTypesMap) {
            MachineTypesMap[a].updateMachineType();
            var c = MachineTypesMap[a],
                d = c.id,
                e;
            for (e in c.MachineCoords)
                if (worldTimeIndexAdd++, 0 == Level.getTime() % 50) {
                    var f = c.MachineCoords[e],
                        g = getTile(f.x, f.y, f.z);
                    0 == g ? 0 != getTile(f.x, 0, f.z) ? (handleRemove(f), c.MachineCoords.splice(e, 1), e--) : f.disactive = !0 : g == d ? (f.disactive &&
                        animateCoords(ParticleType.redstone, f.x, f.y, f.z), f.disactive = !1) : (handleRemove(f), c.MachineCoords.splice(e, 1), e--)
                }
        }
        Level.getTime()
    }
}

function activateMachine(a, c, d) {
    if (!getMachine(a, c, d)) {
        var e = getTile(a, c, d),
            f;
        for (f in MachineTypes) {
            var g = MachineTypes[f];
            if (g.id == e) {
                var h = new Coords(a, c, d);
                h.isActivated = !0;
                addMachine(h, g)
            }
        }
        convertWpdToModelHash(WireAndPipeData)
    }
}

function addMachine(a, c) {
    checkActive(a, c.MachineCoords) || (MachineTypesMap[c.id] && MachineTypesMap[c.id] != c && clientMessage(ChatColor.RED + "[Error] non-matching types id " + c.id), MachineTypesMap[c.id] = c, c.MachineCoords.push(a), animateCoords(ParticleType.redstone, a.x, a.y, a.z), markWithID(a), c.isUsingEnergy() && (217 != c.id && (WireAndPipeData[a.x + "," + a.y + "," + a.z] = TYPE_MACHINE), a.wireUpdated = !1, registerWireChange()), registerReceiverChange())
}

function markWithID(a) {
    a.uniqueID || 0 == a.uniqueID || (a.uniqueID = LastMachineID);
    LastMachineID = Math.max(LastMachineID, a.uniqueID + 1);
    MachineDataByID[a.uniqueID] = a
}
var cachedMachineCoordsList = [];

function getMachine(a, c, d) {
    var e = a + "," + c + "," + d;
    if (cachedMachineCoordsList[e]) return cachedMachineCoordsList[e];
    for (var f in MachineTypes) {
        var g = MachineTypes[f],
            h;
        for (h in g.MachineCoords) {
            var k = g.MachineCoords[h];
            if (k.x == a && k.y == c && k.z == d) return cachedMachineCoordsList[e] = k
        }
    }
}

function getMachineType(a) {
    if (a.savedMachineType) return a.savedMachineType;
    for (var c in MachineTypes) {
        var d = MachineTypes[c],
            e;
        for (e in d.MachineCoords)
            if (a == d.MachineCoords[e]) return a.savedMachineType = d
    }
}

function checkActive(a, c) {
    for (var d in c) {
        var e = a.disactive;
        if (c[d].x == a.x && c[d].y == a.y && c[d].z == a.z) return e && animateCoords(ParticleType.redstone, a.x, a.y, a.z), c[d].disactive = !1, !0
    }
}

function animateCoords(a, c, d, e) {
    for (var f = 0; 35 > f; f++) Level.addParticle(a, c + Math.random(), d + Math.random(), e + Math.random(), 0, 0, 0, 2)
}

function animateBot(a, c, d, e) {
    for (var f = 0; 15 > f; f++) Level.addParticle(a, c - .2 + 1.4 * Math.random(), d + .3 * Math.random(), e - .2 + 1.4 * Math.random(), 0, 0, 0, 2)
}

function animateSmoke(a, c, d, e) {
    for (var f = 0; 15 > f; f++) Level.addParticle(a, c + Math.random(), d + 1, e + Math.random(), 0, .12, 0, 2)
}

function animateRange(a, c, d, e, f, g) {
    g || (g = 1);
    for (var h = 0; h < g; h++) {
        var k = 7 * Math.random(),
            l = 7 * Math.random(),
            m = c + Math.sin(k) * Math.cos(l) * f,
            k = d + Math.cos(k) * Math.cos(l) * f,
            l = e + Math.sin(l) * f;
        Level.addParticle(a, m, k, l, 0, 0, 0, 1)
    }
}

function saveAllMachines() {
    DataSaver.Save("qah", qArmorLastHealth);
    updateEnergyWebs();
    DataSaver.Save("wpdMobPos", possibleWireMobPos);
    saveWireAndPipeData();
    var a = 0,
        c;
    for (c in MachineTypes) {
        var d = MachineTypes[c],
            e;
        for (e in d.MachineCoords) {
            var f = d.MachineCoords[e],
                g = 1;
            f.isActivated && (g = 2);
            var h = "m" + a;
            DataSaver.SaveCoords(h, f);
            DataSaver.Save(h + "#type", c);
            DataSaver.Save(h + "#da", f.disactive);
            DataSaver.Save(h + "#uID", f.uniqueID);
            DataSaver.Save(h + "#e", f.energyStored);
            DataSaver.Save(h + "#actState", g);
            f.container &&
                f.container.save(h + "#container");
            d.save(h + "#", f);
            a++
        }
    }
    DataSaver.Save("m_saved", a);
    DataSaver.WriteFileData()
}

function readAllSaves() {
    DataSaver.ReadFileData();
    possibleWireMobPos = DataSaver.ReadCoords("wpdMobPos");
    qArmorLastHealth = DataSaver.ReadNumber("qah");
    resetMachineTypes();
    readWireAndPipeData();
    for (var a = DataSaver.ReadNumber("m_saved"), c = 0; c < a; c++) {
        var d = "m" + c,
            e = DataSaver.ReadCoords(d);
        e.fuel = DataSaver.ReadNumber(d + "#fuel");
        e.disactive = DataSaver.ReadBool(d + "#da");
        e.uniqueID = DataSaver.ReadNumber(d + "#uID");
        e.energyStored = DataSaver.ReadNumber(d + "#e");
        e.isActivated = 1 != DataSaver.ReadNumber(d + "#actState");
        var f =
            DataSaver.ReadNumber(d + "#type");
        if (f = MachineTypes[f]) f.getContainer(e) && e.container.read(d + "#container"), f.read(d + "#", e), addMachine(e, f)
    }
    clientMessage("loaded " + a + " machines")
}

function startAutoSave() {
    runAsGUI(function() {
        saveAllMachines()
    })
}
var DataSaver = {
    FilePath: "",
    FileWriter: null,
    Reset: function() {
        this.InitFilePath()
    },
    ReadString: function(a) {
        return this.Read(a)
    },
    ReadFloat: function(a) {
        a = parseFloat(this.Read(a));
        a != a && (a = 0);
        return a
    },
    ReadNumber: function(a) {
        return parseInt(this.ReadFloat(a))
    },
    ReadBool: function(a) {
        return "true" == this.Read(a)
    },
    SaveCoords: function(a, c) {
        this.Save(a + "#x", c.x);
        this.Save(a + "#y", c.y);
        this.Save(a + "#z", c.z)
    },
    ReadCoords: function(a) {
        var c = this.ReadFloat(a + "#x"),
            d = this.ReadFloat(a + "#y");
        a = this.ReadFloat(a + "#z");
        return new Coords(c,
            d, a)
    },
    InitFilePath: function() {
        this.FilePath = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/games/com.mojang/minecraftWorlds/" + Level.getWorldDir() + "/factorization.saves"
    },
    StartWriting: function() {
        this.FileWriter = new java.io.PrintWriter(new java.io.BufferedWriter(new java.io.FileWriter(this.FilePath, !1)))
    },
    StopWriting: function() {
        this.FileWriter.close();
        this.FileWrier = 0
    },
    writeLine: function(a) {
        this.FileWriter.write(a + "\n")
    },
    Save: function(a, c) {
        this.FileData[a] = c
    },
    Read: function(a) {
        return this.FileData[a] +
            ""
    },
    WriteFileData: function() {
        this.StartWriting();
        for (var a in this.FileData) this.writeLine(a + "@" + this.FileData[a]);
        this.StopWriting()
    },
    FileData: {},
    ReadFileData: function() {
        this.FileData = [];
        try {
            for (var a = java.io.BufferedReader(new java.io.FileReader(this.FilePath)), c = a.readLine(); c;) {
                var d = c.split("@");
                this.FileData[d[0]] = d[1];
                c = a.readLine()
            }
        } catch (e) {}
    }
};

function removeMachine(a, c, d) {
    for (var e in MachineTypes) {
        var f = MachineTypes[e],
            g;
        for (g in f.MachineCoords) {
            var h = f.MachineCoords[g];
            h.x == a && h.y == c && h.z == d && (h.removed = !0, handleRemove(h), f.MachineCoords.splice(g, 1), g--)
        }
    }
}

function handleRemove(a) {
    getMachineType(a).onDestroy(a);
    a.container && (a.container.dropInv(a.x + .5, a.y + .5, a.z + .5), a.container.onDestroy());
    a.removed = !0;
    animateCoords(ParticleType.redstone, a.x, a.y, a.z);
    DisconnectAllFromMachine(a);
    registerReceiverChange();
    cachedMachineCoordsList[a.x + "," + a.y + "," + a.z] = null
}
var globalWorldTime;

function modTick() {
    if (Level.getSrcTime)
        if (Images.slot) {
            globalWorldTime++;
            var a = getCarriedItem();
            tickMachineTypes();
            1 == Level.getTime() % 4 && updateEnergyWebs();
            currentMachinePlace && (activateMachine(currentMachinePlace.x, currentMachinePlace.y, currentMachinePlace.z), activateMachine(currentMachinePlace.ox, currentMachinePlace.oy, currentMachinePlace.oz), currentMachinePlace = null);
            if (currentWirePipePlace) {
                var c = currentWirePipePlace,
                    d = getTile(c.x, c.y, c.z);
                if (215 == d || 216 == d || 217 == d) WireAndPipeData[c.x + "," + c.y +
                    "," + c.z] = d, 215 == d ? registerWireChange() : registerPipeChange();
                currentWirePipePlace = null
            }
            c = Level.getTime();
            updateQuantiumArmor();
            5 == c % 10 && toolTick(a);
            0 == c % 10 && tickWorldGenerator();
            tickBindedMob(a);
            tickRubberHelmet(a);
            updateHandBottle(a);
            tickBeeEntities();
            oilTick();
            tickEntitiesForUpdate();
            wpdModelTick();
            500 == a ? tickWrenchInfo() : setInfoText("");
            0 == c % 500 && startAutoSave();
            CachedChestInventory = []
        } else ModPE.showTipMessage(ChatColor.RED + "No GUI Textures. Use GUI Fixer.");
    else ModPE.showTipMessage(ChatColor.RED +
        "factorization disabled, reload world to enable")
}
var currentMachinePlace = null,
    currentWirePipePlace = null;

function onMachinePlaced(a, c, d, e, f, g) {
    var h = getTile(a, c, d);
    31 != h && 32 != h && 78 != h && (0 == e && c--, 1 == e && c++, 2 == e && d--, 3 == e && d++, 4 == e && a--, 5 == e && a++);
    0 == getTile(a, c, d) && (setTile(a, c, d, f, g), activateMachine(a, c, d), a = Player.getCarriedItemCount() - 1, 1 > a && (f = 0), Entity.setCarriedItem(getPlayerEnt(), f, a, 0));
    preventDefault()
}

function onWirePlaced(a, c, d, e) {
    var f = getTile(a, c, d);
    31 != f && 32 != f && 78 != f && (0 == e && c--, 1 == e && c++, 2 == e && d--, 3 == e && d++, 4 == e && a--, 5 == e && a++);
    currentWirePipePlace = new Coords(a, c, d)
}
var itemsToPutOn = {
    462: 1,
    463: 1,
    452: 3,
    453: 2,
    454: 1,
    455: 0
};

function onWireItemUse(a, c, d, e) {
    getTile(a, c, d);
    0 == e && c--;
    1 == e && c++;
    2 == e && d--;
    3 == e && d++;
    4 == e && a--;
    5 == e && a++;
    setTile(a, c, d, 215);
    currentWirePipePlace = new Coords(a, c, d);
    1 != Level.getGameMode() && (a = 489, c = Player.getCarriedItemCount(), c--, 0 == c && (a = 0), Entity.setCarriedItem(getPlayerEnt(), a, c, 0))
}

function setPlayerItem(a, c, d) {
    1 > a && (d = c = 0);
    1 > c && (d = a = 0);
    Entity.setCarriedItem(getPlayerEnt(), a, c, d)
}
var currentConnectableMachine = null,
    currentChestTransporter = null,
    lastConnectorClick = -999,
    openedChestInvKey = "#";

function useItem(a, c, d, e, f, g) {
    FactAPI.InvokeCallback("useItem", a, c, d, e, f, g);
    ConstoneItemUse(a, c, d, e, f, g);
    54 == e && registerReceiverChange();
    2 != f && 3 != f && 60 != f || 486 != e || 0 != getTile(a, c + 1, d) || (setPlayerItem(e, Player.getCarriedItemCount() - 1, 0), setTile(a, c + 1, d, 254), activateMachine(a, c + 1, d));
    if (500 != e && 229 == f) {
        var h = getMachine(a, c, d);
        if (h) {
            var k = getMachineType(h);
            k.itemClick(h, e, Player.getCarriedItemData(), g);
            k.tryOpenGUI(h)
        }
    } else if (236 != f || getMachine(a, c, d) || (preventDefault(), activateMachine(a, c, d)), 494 ==
        e && isMachine(f))(h = getMachine(a, c, d)) ? batteryItemClick(h) : clientMessage("not activated!");
    else if (445 == e && isMachine(f))(h = getMachine(a, c, d)) ? EnergyCrystalClick(h) : clientMessage("not activated!");
    else {
        if (isMachine(f) && 500 != e && 494 != e && 503 != e && (h = getMachine(a, c, d)) && (k = getMachineType(h), (208 != f || (325 != e || 0 != Player.getCarriedItemData()) && 475 != e) && k && k.tryOpenGUI(h))) {
            preventDefault();
            return
        }
        215 != e && 216 != e && 217 != e || onWirePlaced(a, c, d, g);
        isMachine(e) && (h = {
            0: 2,
            1: 0,
            2: 3,
            3: 1
        }[parseInt((Entity.getYaw(getPlayerEnt()) -
            45) / 90 + 4) % 4], onMachinePlaced(a, c, d, g, e, h));
        331 == e && activateMachine(a, c, d);
        461 == e && ScrabBoxUse(); - 1 < itemsToPutOn[e] && (g = itemsToPutOn[e], h = Player.getCarriedItemData(), Entity.setCarriedItem(getPlayerEnt(), Player.getArmorSlot(g), 1, Player.getArmorSlotDamage(g)), Player.setArmorSlot(g, e, h));
        if (500 == e && isMachine(f)) {
            h = getMachine(a, c, d);
            if (!h) {
                clientMessage("not activated!");
                return
            }
            k = getMachineType(h);
            if (!k) {
                clientMessage("not activated!");
                return
            }
            k.wrenchClick(h);
            1 < g && setTile(a, c, d, f, {
                2: 1,
                3: 0,
                4: 3,
                5: 2
            }[g]);
            k.isUsingEnergy() && (clientMessage("stored energy: " + parseInt(k.getEnergyStored(h)) + "/" + k.getMaxEnergyStored()), 212 == f && clientMessage("reactor heat: " + h.temp + "/2000"));
            h.webObj && clientMessage(ChatColor.GREEN + "web: gens=" + h.webObj.generators.length + " machines=" + h.webObj.machines.length)
        }
        if (497 == e && 218 == f) {
            h = getMachine(a, c, d);
            if (!h) {
                clientMessage("not activated!");
                return
            }
            k = getMachineType(h);
            if (!k) {
                clientMessage("not activated!");
                return
            }
            k.teleportEntity(getPlayerEnt(), h)
        }
        500 != e && 208 == f && (h = getMachine(a,
            c, d), barrel_itemTap(h, e, Player.getCarriedItemData()));
        if (234 == f && 486 == getCarriedItem()) {
            h = getMachine(a, c, d);
            if (!h) return;
            k = getMachineType(h);
            k.saplingClick(h)
        }
        194 == f && 487 == getCarriedItem() && TreetapLatexUse(a, c, d, g);
        489 == getCarriedItem() && 61 != f && 62 != f && 58 != f && 54 != f && onWireItemUse(a, c, d, g);
        444 == e && (h = Player.getCarriedItemData(), 975 > h && (LaserShot(), h = Math.min(1E3, h + 25), Entity.setCarriedItem(getPlayerEnt(), e, 1, h)));
        oilUseItem(a, c, d, e, f, g)
    }
}
var allRecipesAdded = !1;
ModPE.setItem(500, "blaze_powder", 0, "wrench", 1);
ModPE.setItem(501, "record_cat", 0, "dust iron");
ModPE.setItem(502, "record_chirp", 0, "dust gold");
ModPE.setItem(504, "record_13", 0, "nuclear cell", 1);
ModPE.setItem(505, "record_far", 0, "cooling 60k helium cell", 1);
ModPE.setItem(506, "record_blocks", 0, "overclocker upgrade", 4);
ModPE.setItem(507, "record_mellohi", 0, "advanced machine module");
ModPE.setItem(508, "record_mall", 0, "uu-matter");
ModPE.setItem(497, "ender_pearl", 0, "teleport accesser", 1);
ModPE.setItem(494, "ender_eye", 0, "battery", 1);
ModPE.setItem(499, "blaze_rod", 0, "nano saber", 1);
ModPE.setItem(489, "skull_steve", 0, "wire");
ModPE.setItem(469, "ghast_tear", 0, "circuit");
ModPE.setItem(476, "spider_eye", 0, "advanced circuit");
ModPE.setItem(484, "item_frame", 0, "steel ingot");
ModPE.setItem(477, "hopper", 0, "iridium composit");
ModPE.setItem(465, "map_empty", 0, "liquid matter bucket", 1);
ModPE.setItem(466, "nether_star", 0, "biomass bucket", 1);
ModPE.setItem(467, "nether_wart", 0, "fuel bucket", 1);
ModPE.setItem(450, "fireworks", 0, "carbonium plate");
ModPE.setItem(451, "experience_bottle", 0, "composite plate");
ModPE.setItem(448, "apple_golden", 0, "raw carbon");
ModPE.setItem(449, "book_enchanted", 0, "composite ingot");
ModPE.setItem(447, "rotten_flesh", 0, "coal dust");
ModPE.setItem(445, "map_filled", 0, "energy crystal", 1);
ModPE.setItem(440, "cauldron", 0, "coal ball");
ModPE.setItem(441, "saddle", 0, "coal chunk");
Item.setMaxDamage(504, 1024);
Item.setMaxDamage(505, 4096);
Item.setMaxDamage(494, 1002);
Item.setMaxDamage(499, 2E3);
Item.setMaxDamage(445, 1E4);
try {
    Item.setHandEquipped(510, !0), Item.setHandEquipped(509, !0), Item.setHandEquipped(499, !0), Item.setHandEquipped(444, !0)
} catch (e$$13) {
    print(" launcher outdated")
}

function newLevel() {
    ReadMcOptions();
    resetAllIngameValues();
    defineMachine(199, "machine block", ["cauldron_top", "cauldron_top"]);
    defineMachine(200, "recycler", ["cauldron_top", "cauldron_inner"]);
    defineMachine(201, "crop harvester", ["cauldron_bottom", "anvil_top_damaged_x"]);
    defineMachine(202, "quarry", ["cauldron_bottom", "cauldron_side"]);
    defineMachine(203, "chest transporter", ["enchanting_table_bottom", "enchanting_table_bottom"]);
    defineMachine(204, "macerator", ["cauldron_top", "enchanting_table_top"]);
    defineMachine(205,
        "beacon", ["cauldron_top", "redstone_dust_cross"], 1);
    defineMachine(207, "drill station", ["cauldron_top", "cauldron_side"]);
    defineMachine(208, "barrel", ["barrel", "barrel"], 1, 0, 1);
    defineMachine(209, "solar pannel", ["cauldron_top", "redstone_lamp_on"], 1);
    defineMachine(210, "bat-box", ["cauldron_top", "rail_detector_powered"], 1);
    defineMachine(211, "fuel generator", ["cauldron_top", "redstone_lamp_off"], 0);
    defineMachine(212, "nuclear reactor", ["quartz_ore", "nuke"], 2, 0, 0);
    defineMachine(213, "electric furnace", ["cauldron_top",
        "rail_activator"
    ], 0);
    defineMachine(214, "mass fabricator", ["jukebox_top", "rail_activator_powered"], 0);
    defineMachine(218, "teleporter", ["cauldron_top", "piston_bottom"], 1);
    defineMachine(219, "windmill", ["redstone_torch_on", "redstone_torch_on"], 0);
    defineMachine(220, "watermill", ["redstone_torch_off", "redstone_torch_off"], 0);
    defineMachine(221, "geotermal generator", ["cauldron_top", "repeater_off"], 0);
    defineMachine(222, "pump", ["pump", "cauldron_top"], 2, 0, 0);
    defineMachine(223, "auto-milker", ["filler", "cauldron_top"],
        2, 0, 0);
    defineMachine(224, "bucket filler", ["enchanting_table_side", "cauldron_top"], 2);
    defineMachine(225, "growth accelerator", ["anvil_top_damaged_x", "cauldron_top"], 2, 0, 0);
    defineMachine(226, "mob slayer", ["anvil_top_damaged_x", "cauldron_top"], 2, 1, 0);
    defineMachine(227, "auto feeder", ["anvil_top_damaged_x", "cauldron_top"], 2, 2, 0);
    defineMachine(228, "defender", ["brewing_stand", "cauldron_top"], 2, 0, 0);
    defineMachine(229, "assembler", ["redstone_dust_line", "redstone_dust_line"]);
    defineMachine(230, "liquid blender", ["redstone_torch_off", "cauldron_side"], 2, 0, 0);
    defineMachine(231, "block breaker", ["cauldron_top", "cauldron_bottom"], 2, 0, 0);
    defineMachine(232, "heater", ["repeater_off", "redstone_torch_on"], 2, 0, 0);
    defineMachine(233, "nuclear bomb", ["jukebox_side", "tnt"], 2, 0, 1);
    defineMachine(234, "rubber tree harvester", ["brewing_stand_base", "farmland"], 2, 0, 0);
    defineMachine(235, "MFE", ["rail_detector", "rail_detector_powered"], 1);
    defineMachine(236, "wild hive", ["log", "chest_inventory"], 0, 0, 0);
    defineMachine(237, "bee hive", ["hive",
        "chest_inventory"
    ], 2, 0, 0);
    Block.setColor(237, [14535850]);
    defineMachine(238, "centrefuge", ["cauldron_bottom", "redstone_torch_on"], 0, 0, 0);
    defineMachine(239, "extractor", ["cauldron_top", "flower_pot"], 0, 0, 0);
    defineMachine(240, "terraformer", ["redstone_block", "cauldron_top"], 2, 0, 0);
    defineMachine(241, "bioreactor", ["nether_wart", "log"], 2, 1, 0);
    defineMachine(242, "fuel factory", ["nether_wart", "cauldron_top"], 2, 2, 0);
    defineMachine(250, "liquid fuel engine", ["nether_wart", "cauldron_top"], 2, 0, 0);
    defineMachine(251,
        "replicator", ["itemframe_background", "cauldron_top"], 2, 0, 0);
    defineMachine(252, "MFSU", ["rail_detector", "rail_detector_powered"], 1);
    defineMachine(253, "compressor", ["cauldron_top", "soul_sand"]);
    defineMachine(130, "reactor cell", ["nuke", "cauldron_top"], 2, 0, 0);
    Block.defineBlock(254, "rubber tree sappling", ["brewing_stand_base"], 1, !1, Block.getRenderType(105));
    Block.setRenderLayer(254, 5);
    Block.setLightOpacity(254, 0);
    defineWire(215, "wire", ["piston_top_sticky"], 0);
    defineWire(216, "pipe", ["piston_inner"], 0);
    defineWire(217,
        "receiver", ["piston_side"], 0);
    Block.setLightLevel(205, 14);
    Block.setLightLevel(212, 13);
    Block.setColor(208, [16772795]);
    Block.setColor(252, [16742399]);
    Block.setDestroyTime(254, 0);
    allRecipesAdded || (Item.addShapedRecipe(489, 9, 0, ["aaa", "xxx", "aaa"], ["x", 480, 0, "a", 488, 0]), Item.addShapedRecipe(494, 1, 1001, [" x ", "aba", "aba"], ["x", 489, 0, "a", 481, 0, "b", 331, 0]), Item.addShapedRecipe(469, 1, 0, ["xxx", "aba", "xxx"], ["x", 489, 0, "a", 331, 0, "b", 484, 0]), Item.addShapedRecipe(476, 1, 0, ["aba", "cxc", "aba"], ["x", 469, 0, "a", 331,
        0, "b", 348, 0, "c", 351, 4
    ]), Item.addShapedRecipe(199, 1, 0, ["xxx", "x x", "xxx"], ["x", 484, 0]), Item.addShapedRecipe(484, 8, 0, ["   ", "   ", "x  "], ["x", 199, 0]), Item.addShapedRecipe(348, 1, 0, ["xax", "axa", "xax"], ["a", 502, 0, "x", 331, 0]), Item.addShapedRecipe(507, 1, 0, ["cac", "aba", "cac"], ["a", 331, 0, "c", 484, 0, "b", 264, 0]), Item.addShapedRecipe(477, 1, 0, ["cac", "aba", "cac"], ["a", 451, 0, "c", 496, 0, "b", 264, 0]), Item.addShapedRecipe(500, 1, 0, ["x x", "xxx", " x "], ["x", 265, 0]), Item.addShapedRecipe(506, 1, 0, ["   ", "xxx", "aba"], ["x", 325,
        8, "a", 489, 0, "b", 469, 0
    ]), Item.addShapedRecipe(504, 1, 0, ["cac", "aba", "cac"], ["a", 502, 0, "c", 265, 0, "b", 331, 0]), Item.addShapedRecipe(505, 1, 0, ["cac", "aba", "cac"], ["a", 501, 0, "c", 265, 0, "b", 264, 0]), Item.addShapedRecipe(200, 1, 0, [" e ", "aba", "dcd"], ["a", 3, 0, "b", 469, 0, "c", 199, 0, "d", 484, 0, "e", 331, 0]), Item.addShapedRecipe(201, 1, 0, ["   ", " d ", "abc"], ["a", 292, 0, "b", 199, 0, "c", 258, 0, "d", 469, 0]), Item.addShapedRecipe(202, 1, 0, ["   ", "dbd", "aca"], ["a", 199, 0, "b", 331, 0, "c", 278, 0, "d", 476, 0]), Item.addShapedRecipe(203, 1, 0, ["b  ", "x  ", "a  "], ["x", 469, 0, "a", 54, 0, "b", 331, 0]), Item.addShapedRecipe(204, 1, 0, ["aaa", "bcb", " x "], ["a", 318, 0, "b", 4, 0, "c", 199, 0, "x", 469, 0]), Item.addShapedRecipe(207, 1, 0, ["xax", "xbx", "xcx"], ["a", 54, 0, "b", 469, 0, "c", 257, 0]), Item.addShapedRecipe(213, 1, 0, [" a ", "cbc", " d "], ["a", 469, 0, "c", 331, 0, "b", 61, 0, "d", 199, 0]), Item.addShapedRecipe(218, 2, 0, ["   ", "xax", "cbc"], ["x", 348, 0, "a", 507, 0, "c", 476, 0, "b", 199, 0]), Item.addShapedRecipe(239, 1, 0, ["   ", "cdc", "aba"], ["d", 487, 0, "a", 469, 0, "c", 489, 0, "b", 199, 0]), Item.addShapedRecipe(253,
        1, 0, ["x x", "xax", "xbx"], ["a", 199, 0, "b", 469, 0, "x", 1, 0]), Item.addShapedRecipe(209, 1, 0, ["xxx", "aaa", "zyz"], ["x", 20, 0, "a", 447, 0, "z", 489, 0, "y", 199, 0]), Item.addShapedRecipe(211, 1, 0, ["a  ", "b  ", "c  "], ["a", 469, 0, "c", 61, 0, "b", 199, 0]), Item.addShapedRecipe(212, 1, 0, ["cac", "aba", "cac"], ["a", 476, 0, "c", 451, 0, "b", 199, 0]), Item.addShapedRecipe(130, 1, 0, ["cac", "aba", "cac"], ["a", 450, 0, "b", 199, 0]), Item.addShapedRecipe(214, 1, 0, ["aba", "cdc", "aba"], ["a", 348, 0, "c", 507, 0, "b", 476, 0, "d", 199, 0]), Item.addShapedRecipe(219, 1, 0, ["x x", " a ", "x x"], ["x", 484, 0, "a", 199, 0]), Item.addShapedRecipe(220, 2, 0, ["bxb", "xax", "bxb"], ["x", 5, 0, "a", 199, 0, "b", 280, 0]), Item.addShapedRecipe(221, 1, 0, ["xcx", "xcx", "aba"], ["c", 20, 0, "b", 211, 0, "a", 325, 0, "x", 484, 0]), Item.addShapedRecipe(205, 1, 0, ["xbx", "xax", "xxx"], ["a", 348, 0, "x", 265, 0, "b", 289, 0]), Item.addShapedRecipe(235, 1, 0, ["aba", "bcb", "aba"], ["c", 199, 0, "b", 264, 0, "a", 489, 0]), Item.addShapedRecipe(210, 1, 0, ["aba", "dcd", "aaa"], ["a", 265, 0, "b", 489, 0, "d", 331, 0, "c", 494, 0]), Item.addShapedRecipe(216, 8, 0, ["   ",
        "xax", "   "
    ], ["x", 265, 0, "a", 20, 0]), Item.addShapedRecipe(217, 1, 0, ["   ", "x  ", "a  "], ["x", 469, 0, "a", 216, 0]), Item.addShapedRecipe(509, 1, 299, [" x ", "xbx", "aca"], ["x", 264, 0, "a", 49, 0, "b", 469, 0, "c", 494, 0]), Item.addShapedRecipe(510, 1, 299, [" xa", "xbx", "cx "], ["x", 265, 0, "a", 264, 0, "b", 469, 0, "c", 494, 0]), Item.addShapedRecipe(497, 1, 0, ["x  ", " y ", "  z"], ["x", 507, 0, "y", 265, 0, "z", 348, 0]), Item.addShapedRecipe(496, 1, 0, ["   ", "a  ", "a  "], ["a", 493, 0]), Item.addShapedRecipe(504, 2, 0, ["cac", "aba", "cac"], ["a", 495, 0, "c",
        265, 0, "b", 501, 0
    ]), Item.addShapedRecipe(499, 1, 1, ["ab ", "ab ", "cdc"], ["a", 348, 0, "c", 476, 0, "b", 496, 0, "d", 507, 0]), Item.addShapedRecipe(208, 1, 0, ["bab", "a a", "bab"], ["b", 17, 0, "a", 20, 0]), Item.addShapedRecipe(222, 2, 0, ["bab", "cxc", "bab"], ["a", 325, 0, "b", 484, 0, "c", 20, 0, "x", 469, 0]), Item.addShapedRecipe(223, 1, 0, ["   ", "cac", "bdb"], ["a", 325, 0, "b", 484, 0, "c", 20, 0, "d", 469, 0]), Item.addShapedRecipe(224, 1, 0, ["cdc", " b ", " a "], ["a", 325, 0, "b", 199, 0, "c", 469, 0, "d", 54, 0]), Item.addShapedRecipe(225, 1, 0, ["   ", "cdc", "aba"], ["a", 325, 8, "d", 208, 0, "b", 484, 0, "c", 469, 0]), Item.addShapedRecipe(226, 1, 0, ["   ", "cdc", "aba"], ["a", 484, 0, "d", 267, 0, "b", 199, 0, "c", 469, 0]), Item.addShapedRecipe(228, 1, 0, [" e ", "cdc", "aba"], ["a", 484, 0, "d", 276, 0, "b", 199, 0, "c", 476, 0, "e", 259, 0]), Item.addShapedRecipe(227, 1, 0, [" d ", "bcb", "axa"], ["a", 331, 0, "d", 54, 0, "b", 484, 0, "c", 296, 0, "x", 469, 0]), Item.addShapedRecipe(229, 1, 0, [" a ", "aba", " a "], ["a", 469, 0, "b", 58, 0]), Item.addShapedRecipe(230, 1, 0, ["aba", "cxc", "ddd"], ["a", 216, 0, "b", 208, 0, "c", 325, 0, "d", 484, 0, "x",
        469, 0
    ]), Item.addShapedRecipe(231, 1, 0, [" a ", " b ", " c "], ["a", 469, 0, "b", 199, 0, "c", 257, 0]), Item.addShapedRecipe(232, 1, 0, ["aba", "cdc", "aea"], ["a", 484, 0, "b", 494, 0, "c", 469, 0, "d", 325, 0, "e", 494, 0]), Item.addShapedRecipe(233, 1, 0, ["aba", "aca", "aba"], ["a", 495, 0, "b", 46, 0, "c", 504, 0]), Item.addShapedRecipe(487, 1, 0, [" a ", "aaa", "a  "], ["a", 5, 0]), Item.addShapedRecipe(237, 1, 0, ["aba", "bcb", "aba"], ["a", 488, 0, "b", 280, 0, "c", 208, 0]), Item.addShapedRecipe(238, 1, 0, [" a ", "bcb", "ded"], ["a", 208, 0, "b", 469, 0, "c", 325, 0, "d", 484,
        0, "e", 216, 0
    ]), Item.addShapedRecipe(475, 1, 0, ["   ", "   ", "x  "], ["x", 20, 0]), addMatterRecipes(), Item.addShapedRecipe(302, 1, 2995, ["aba", "cdc", "   "], ["a", 477, 0, "b", 455, 0, "c", 476, 0, "d", 20, 0]), Item.addShapedRecipe(303, 1, 2995, ["aba", "axa", "aca"], ["a", 477, 0, "c", 507, 0, "d", 476, 0, "x", 454, 0]), Item.addShapedRecipe(304, 1, 2995, ["xbx", "a a", "c c"], ["a", 477, 0, "b", 453, 0, "c", 348, 0, "x", 199, 0]), Item.addShapedRecipe(305, 1, 2995, ["   ", "aca", "aba"], ["a", 477, 0, "b", 452, 0, "c", 476, 0]), Item.addShapedRecipe(461, 1, 0, ["xxx", "xxx",
        "xxx"
    ], ["x", 460, 0]), Item.addShapedRecipe(468, 1, 0, ["xxx", "xax", "xxx"], ["x", 280, 0, "a", 287, 0]), Item.addShapedRecipe(240, 1, 0, ["   ", "aba", "cdc"], ["a", 256, 0, "b", 507, 0, "c", 476, 0, "d", 199, 0]), Item.addShapedRecipe(463, 1, 5999, ["c c", "aba", "c c"], ["a", 469, 0, "b", 494, 0, "c", 331, 0]), Item.addShapedRecipe(462, 1, 1999, ["aba", "aca", "d d"], ["a", 484, 0, "b", 469, 0, "c", 494, 0, "d", 348, 0]), Item.addShapedRecipe(250, 1, 0, [" d ", "aca", "aba"], ["a", 469, 0, "b", 199, 0, "c", 208, 0, "d", 494, 0]), Item.addShapedRecipe(241, 1, 0, ["   ", " b ", "aca"], ["a", 20, 0, "b", 469, 0, "c", 208, 0]), Item.addShapedRecipe(242, 1, 0, ["axa", "cbc", "axa"], ["a", 489, 0, "b", 199, 0, "c", 216, 0, "x", 469, 0]), Item.addShapedRecipe(251, 1, 0, [" x ", "bcb", "aaa"], ["a", 20, 0, "b", 476, 0, "c", 507, 0, "x", 325, 0]), Item.addShapedRecipe(252, 1, 0, ["xax", "xbx", "xax"], ["a", 476, 0, "b", 235, 0, "x", 507, 0]), Item.addShapedRecipe(448, 1, 0, ["xxx", "x x", "xxx"], ["x", 447, 0]), Item.addShapedRecipe(449, 1, 0, ["aaa", "bbb", "ccc"], ["a", 480, 0, "b", 481, 0, "c", 484, 0]), Item.addShapedRecipe(452, 1, 1, ["   ", "x x", "xax"], ["x", 450, 0,
        "a", 445, 0
    ]), Item.addShapedRecipe(453, 1, 1, ["xax", "x x", "x x"], ["x", 450, 0, "a", 445, 0]), Item.addShapedRecipe(454, 1, 1, ["x x", "xax", "xxx"], ["x", 450, 0, "a", 445, 0]), Item.addShapedRecipe(455, 1, 1, ["xax", "xbx", "   "], ["x", 450, 0, "a", 445, 0, "b", 20, 0]), Item.addShapedRecipe(456, 1, 128, [" x ", "x x", "ax "], ["a", 280, 0, "x", 265, 0]), Item.addShapedRecipe(456, 1, 0, [" x ", "xax", " x "], ["x", 446, 0, "a", 456, 0]), Item.addShapedRecipe(444, 1, 1E3, ["abb", " cb", "   "], ["a", 445, 0, "b", 451, 0, "c", 507, 0]), Item.addShapedRecipe(445, 1, 1E4, ["xxx",
        "xax", "xxx"
    ], ["x", 331, 0, "a", 264, 0]), Item.addShapedRecipe(440, 1, 0, ["aaa", "aba", "aaa"], ["a", 263, 0, "b", 318, 0]), Item.addShapedRecipe(441, 1, 0, ["aaa", "aba", "aaa"], ["a", 440, 0, "b", 49, 0]), Item.addFurnaceRecipe(501, 265, 0), Item.addFurnaceRecipe(502, 266, 0), Item.addFurnaceRecipe(482, 480, 0), Item.addFurnaceRecipe(483, 481, 0), Item.addFurnaceRecipe(188, 480, 0), Item.addFurnaceRecipe(189, 481, 0), Item.addFurnaceRecipe(265, 484, 0), Item.addFurnaceRecipe(485, 488, 0), addCreativeItems([200, 201, 202, 203, 204, 205, 207, 209, 210, 211,
        212, 130, 213, 214, 216, 217, 218, 219, 220, 221, 222, 208, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 235, 236, 237, 238, 239, 240, 241, 242, 250, 251, 252, 302, 303, 304, 305, 253
    ]), allRecipesAdded = !0);
    defineOilBlocks();
    clientMessage(ChatColor.GREEN + "[BUILD] Factorization 3.9.3");
    initContainerGUI();
    newLevel_gui();
    eh_clear();
    setPlayerCape();
    FactAPI.addonInfo();
    DataSaver.Reset();
    readAllSaves();
    FactAPI.InvokeCallback("LevelLoaded")
}
var ParticlesDisabled = !1;

function resetAllIngameValues() {
    GUIString = "zheka";
    Level.getSrcTime || (Level.getSrcTime = Level.getTime, Level.getTime = function() {
        return globalWorldTime + worldTimeIndexAdd
    });
    Level.addParticleSrc || (Level.addParticleSrc = Level.addParticle);
    globalWorldTime = 0;
    currentChestTransporter = currentConnectableMachine = null;
    cachedMachineCoordsList = [];
    lastConnectorClick = -999;
    jetpackDamage = firstTickTime = lastPowerShieldHealth = -1;
    jetpackLastY = 1E4;
    lastJetpackHealth = -1;
    isGuiDisabled = !1;
    rubberHelmData = -1;
    rubberHelmCoords = null;
    bottleLastHealth = 1001;
    bottleMeadEffect = bottleLastCarried = 0;
    CachedChestInventory = [];
    resetQuantiumArmor();
    wasToolCarried = !0;
    lastToolCarried = -1;
    MachineTypesMap = [];
    (ParticlesDisabled = "true" == ModPE.readData("no#particles")) ? (clientMessage(ChatColor.RED + "factorization: all particles disabled"), Level.addParticle = function() {}) : Level.addParticle = Level.addParticleSrc;
    GUIString += "_smirnov";
    resetContainerGUI()
}

function addCreativeItems(a) {
    for (var c in a) Item.getName(a[c], 0, !0), Player.addItemCreativeInv(a[c], 64, 0)
}

function defineMachine(a, c, d, e, f, g) {
    f || (f = 0);
    "undefined" == g + "" && (g = f);
    var h = [
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[0], f]
    ];
    e ? h[1] = [d[1], g] : h = [
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[1], g],
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[1], g],
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[1], g],
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[0], f],
        [d[1], g],
        [d[0], f]
    ];
    2 == e && (h[0] = [d[1], g]);
    try {
        Block.defineBlock(a, c, h, 20, !1, 0)
    } catch (k) {
        print("missing texture " + d), Block.defineBlock(a, c, ["cauldron_top",
            0
        ], 20, !1, 0)
    }
    Block.setDestroyTime(a, 1);
    Block.setRenderLayer(a, 5);
    Block.setLightOpacity(a, 0)
}

function defineWire(a, c, d) {
    Block.defineBlock(a, c, [
        [d[0], 0],
        [d[0], 0],
        [d[0], 0],
        [d[0], 0],
        [d[0], 0],
        [d[0], 0]
    ], 20, !1, 0);
    Block.setDestroyTime(a, .1);
    Block.setRenderLayer(a, 5);
    Block.setLightOpacity(a, 0);
    215 == a && Options_FancyGrap && Block.setShape(a, .30625, .30625, .30625, .69375, .7, .69375)
}

function addMatterRecipes() {
    matRec(2, 32, 0, ["   ", "x  ", "x   "]);
    matRec(17, 32, 0, ["x  ", "   ", "x   "]);
    matRec(14, 8, 0, ["x x", " x ", "x x"]);
    matRec(15, 16, 0, [" x ", "xxx", " x "]);
    matRec(331, 48, 0, ["   ", " x ", "xxx"]);
    matRec(348, 24, 0, ["xxx", " x ", "   "]);
    matRec(264, 3, 0, ["xxx", "xxx", "xxx"]);
    matRec(49, 18, 0, ["x x", "x x", "   "]);
    matRec(20, 32, 0, [" x ", "x x", " x "]);
    matRec(351, 18, 4, ["x  ", "x  ", "xx "]);
    matRec(351, 9, 0, ["xxx", "x  ", "   "]);
    matRec(351, 32, 3, ["xx ", "  x", "xx "]);
    matRec(352, 32, 0, ["xx ", "x  ", "xx "]);
    matRec(318, 32, 0, [" x ", "xx ", "xx "]);
    matRec(8, 1, 0, ["  x", "  x", "   "]);
    matRec(10, 1, 0, ["  x", "  x", "  x"]);
    matRec(496, 1, 0, ["xxx", " x ", "xxx"])
}

function matRec(a, c, d, e) {
    Item.addShapedRecipe(a, c, d, e, ["x", 508, 0])
}
var Options_FancyGrap = !1;

function ReadMcOptions() {
    for (var a = java.io.BufferedReader(new java.io.FileReader(android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/games/com.mojang/minecraftpe/options.txt")), c, d = 0; 15 > d; d++) c = a.readLine();
    Options_FancyGrap = "1" == c.split(":")[1]
}

function leaveGame() {
    saveAllMachines();
    leaveGame_gui();
    closeGUI()
}

function destroyBlock(a, c, d) {
    ConstoneDestroyBlock(a, c, d);
    oilDestroyBlock(a, c, d);
    destroyBlockTool(a, c, d);
    destroyBlock_ore(a, c, d);
    destroyBlock_rubberTree(a, c, d);
    removeMachine(a, c, d);
    215 == getTile(a, c, d) && (preventDefault(), 0 < getTile(a, c, d) && Level.destroyBlock(a, c, d), Level.dropItem(a + .5, c + .5, d + .5, 1, 489, 1, 0), wpdOnChange(a + "," + c + "," + d))
}

function capitateTree(a, c, d, e) {
    for (var f = a - 3; f < a + 4; f++)
        for (var g = c; g < c + 4; g++)
            for (var h = d - 3; h < d + 4; h++) {
                var k = getTile(f, g, h),
                    l = Math.sqrt((a - f) * (a - f) + (c - g) * (c - g) + (d - h) * (d - h)),
                    m = Level.getData(f, g, h) % 4;
                if (18 == k || 161 == k) Level.destroyBlock(f, g, h), 161 == k && (m += 4), 1 > 16 * Math.random() && e.addItem(6, 1, m), 1 > 64 * Math.random() && 0 == m && 18 == k && e.addItem(260, 1, 0);
                (17 == k || 162 == k) && 2 > l && (Level.destroyBlock(f, g, h), e.addItem(k, 1, m), capitateTree(f, g, h, e))
            }
}

function setPlayerCape() {
    LoadGUIStrings()
}
ModPE.setItem(509, "record_stal", 0, "drill", 1);
ModPE.setItem(510, "record_strad", 0, "chainsaw", 1);
Item.setMaxDamage(509, 300);
Item.setMaxDamage(510, 300);

function destroyBlockTool(a, c, d) {
    var e = getTile(a, c, d),
        f = getCarriedItem();
    damageCarriedTool();
    var g = ToolMap[f];
    if (g) {
        for (var h in g) {
            var k = g[h];
            k[0] == e && k[2] && (k = getDropForCoords_(a, c, d), Level.dropItem(a + .5, c + .5, d + .5, 1, k[0], k[1], k[2]))
        }
        509 == f && PlaySoundFile("Tools/Drill/DrillHard.ogg");
        510 == f && PlaySoundFile("Tools/Chainsaw/ChainsawUseOne.ogg")
    }
}

function getDropForCoords_(a, c, d) {
    var e = getTile(a, c, d),
        f = Math.floor(4 + 2 * Math.random());
    a = Level.getData(a, c, d);
    return 1 == e ? 0 == a ? [4, 1, 0] : [1, 1, a] : 2 == e ? [3, 1, 0] : 16 == e ? [263, 1, 0] : 56 == e ? [264, 1, 0] : 73 == e || 74 == e ? [331, f, 0] : 21 == e ? [351, f, 4] : 17 == e ? [17, 1, a % 4] : 18 == e || 162 == e ? [e, 1, a % 4 + 4] : [e, 1, a]
}
var ToolMaxDamage = {
        509: 300,
        510: 300
    },
    ToolList = [509, 510],
    ToolMap = {
        509: [
            [1, 1.5, !0],
            [4, 2, !0],
            [14, 3, !0],
            [15, 3, !0],
            [16, 3, !0],
            [21, 3, !0],
            [56, 3, !0],
            [2, .6, !1],
            [3, .6, !1],
            [60, .6],
            [73, 3, !0],
            [74, 3, !0],
            [129, 3, !0],
            [41, 3, !0],
            [42, 5, !0],
            [57, 5, !0],
            [133, 5, !0],
            [173, 5, !0],
            [61, 3, !0],
            [98, 1.5, !0],
            [112, 2, !0],
            [87, 1, !0],
            [114, 2, !0],
            [104, 2, !0],
            [45, 2, !0],
            [108, 2, !0],
            [109, 2, !0],
            [48, 2, !0],
            [49, 50, !0],
            [12, .6],
            [13, .6],
            [24, 1.5, !0],
            [195, 2],
            [196, 2],
            [197, 2],
            [188, 2],
            [189, 2],
            [76, 2],
            [67, 2, !0],
            [128, 2, !0],
            [139, 2, !0],
            [155, 2, !0],
            [156, 2, !0]
        ],
        510: [
            [17,
                2, !1
            ],
            [18, .5, !0],
            [54, 2.5],
            [58, 2.5],
            [64, 2.5],
            [35, .5],
            [5, 2, !1],
            [161, .5, !0],
            [162, 2],
            [163, 2],
            [164, 2],
            [134, 2],
            [135, 2],
            [136, 2],
            [85, 2],
            [53, 2],
            [107, 2],
            [191, 2],
            [192, 2],
            [193, 0],
            [194, 2],
            [158, 2],
            [157, 2]
        ]
    },
    wasToolCarried = !0,
    lastToolCarried = -1;

function toolTick(a) {
    var c = Player.getCarriedItemData();
    499 == a ? 1999 > c && Entity.setCarriedItem(getPlayerEnt(), 499, 1, c + 1) : (c = isTool(a) && isToolUsable(a, c), !c && wasToolCarried && (resetHardnessForTool(lastToolCarried), wasToolCarried = !1, lastToolCarried = 0), c && a != lastToolCarried && (resetHardnessForTool(lastToolCarried), setUpHardnessForTool(a), wasToolCarried = !0, lastToolCarried = a))
}

function isTool(a) {
    for (var c in ToolList)
        if (ToolList[c] == a) return !0
}

function setUpHardnessForTool(a) {
    if (a = ToolMap[a])
        for (var c in a) {
            var d = a[c];
            Block.setDestroyTime(d[0], d[1] / 50)
        }
}

function resetHardnessForTool(a) {
    if (a = ToolMap[a])
        for (var c in a) {
            var d = a[c];
            Block.setDestroyTime(d[0], d[1])
        }
}

function isToolUsable(a, c) {
    return ToolMaxDamage[a] ? c < ToolMaxDamage[a] - 1 : !0
}

function damageCarriedTool() {
    var a = Player.getArmorSlot(1),
        c = Player.getArmorSlotDamage(1),
        d = getCarriedItem();
    if (isTool(d)) {
        var e = Player.getCarriedItemData();
        if (isToolUsable(d, e)) {
            for (e++; 463 == a && 5994 > c && 1 < e;) c += 6, e--;
            463 == a && Player.setArmorSlot(1, a, c);
            Entity.setCarriedItem(getPlayerEnt(), d, 1, e)
        }
    }
}
ModPE.setItem(496, "record_ward", 0, "iridium");
Item.setMaxDamage(511, 4800);

function attackHook(a, c) {
    var d = getCarriedItem();
    498 == d && (currentMobBind = new MobBindToPlayer(a, c), preventDefault());
    499 == d && 1999 > Player.getCarriedItemData() && Entity.setHealth(c, Math.max(Entity.getHealth(c) - 18, 1));
    509 == d && Entity.setHealth(c, Math.max(Entity.getHealth(c) - 3, 1));
    510 == d && Entity.setHealth(c, Math.max(Entity.getHealth(c) - 5, 1));
    beeAttackHook(a, c)
}
ModPE.setItem(498, "lead", 0, "leash", 1);
Item.setMaxDamage(498, 4E3);
Item.addShapedRecipe(498, 1, 0, ["xx ", "xz ", "  x"], ["z", 280, 0, "x", 287, 0]);

function tickBindedMob(a) {
    currentMobBind && (498 == a ? currentMobBind.update() : currentMobBind = null)
}
var currentMobBind = null;

function MobBindToPlayer(a, c) {
    this.master = a;
    this.victim = c;
    this.dis = 5;
    this.update = function() {
        var a = Entity.getX(this.master),
            c = Entity.getY(this.master) - 1.62,
            f = Entity.getZ(this.master),
            g = Entity.getX(this.victim),
            h = Entity.getY(this.victim),
            k = Entity.getZ(this.victim);
        if (h) {
            var l = a - g,
                m = c - h,
                n = f - k,
                r = Math.sqrt(l * l + m * m + n * n),
                l = l / r,
                m = m / r,
                n = n / r;
            r > this.dis && (setVelX(this.master, Entity.getVelX(this.master) + l * (r - this.dis) * -.1), setVelZ(this.master, Entity.getVelZ(this.master) + n * (r - this.dis) * -.1), setVelX(this.victim,
                l * (r - this.dis)), setVelY(this.victim, m * (r - this.dis) + Entity.getVelY(this.victim)), setVelZ(this.victim, n * (r - this.dis)), .3 > Math.random() && Entity.setCarriedItem(getPlayerEnt(), 498, 1, Player.getCarriedItemData() + 1), 3999 < Player.getCarriedItemData() && Entity.setCarriedItem(getPlayerEnt(), 0, 0, 0));
            this.makeRedstoneRay(a, c + 1, f, g, h + .6, k)
        }
    };
    this.makeRedstoneRay = function(a, c, f, g, h, k) {
        g -= a;
        h -= c;
        k -= f;
        var l = Math.sqrt(g * g + h * h + k * k);
        g /= l;
        h /= l;
        k /= l;
        for (var m = 0; m < l; m += Math.random()) Level.addParticle(ParticleType.crit, a +
            g * m, c + h * m, f + k * m, 0, 0, 0, 1)
    }
}
var rubberHelmData = -1,
    rubberHelmCoords = null;

function tickRubberHelmet() {
    if (!(1 > Entity.getHealth(getPlayerEnt()) || 302 != Player.getArmorSlot(0) || 2990 < Player.getArmorSlotDamage(0))) {
        var a = getPlayerX(),
            a = a + (a / Math.abs(a) - 1) / 2,
            c = getPlayerY(),
            d = getPlayerZ(),
            d = d + (d / Math.abs(d) - 1) / 2; - 1 != rubberHelmData && (setTile(rubberHelmCoords.x, rubberHelmCoords.y, rubberHelmCoords.z, 9, rubberHelmData), rubberHelmData = -1, rubberHelmCoords = null);
        if (0 == Level.getTime() % 100) {
            var e = getTile(a, c, d);
            if (8 == e || 9 == e) rubberHelmData = Level.getData(a, c, d), setTile(a, c, d, 0), rubberHelmCoords = {
                x: a,
                y: c,
                z: d
            }
        }
    }
}
var qArmorData = [0, 0, 0, 0],
    qArmorHealthMode = 0,
    qArmorLastHealth = -1,
    qArmorRTime = 0,
    quantiumMaxDamage = 2999;
ModPE.setItem(462, "fireball", 0, "jetpack", 1);
ModPE.setItem(463, "slimeball", 0, "batpack", 1);
ModPE.setItem(452, "fish_cooked", 0, "nano boots", 1);
ModPE.setItem(453, "fishing_rod_uncast", 0, "nano leggins", 1);
ModPE.setItem(454, "fishing_rod_cast", 0, "nano suit", 1);
ModPE.setItem(455, "fireworks_charge_overlay", 0, "nano helmet", 1);
Item.setMaxDamage(452, 400);
Item.setMaxDamage(453, 400);
Item.setMaxDamage(454, 400);
Item.setMaxDamage(455, 400);
Item.setMaxDamage(302, 3E3);
Item.setMaxDamage(303, 3E3);
Item.setMaxDamage(304, 3E3);
Item.setMaxDamage(305, 3E3);
Item.setMaxDamage(462, 2E3);
Item.setMaxDamage(463, 6E3);
ModPE.langEdit("item.helmetChain.name", "quantium helmet");
ModPE.langEdit("item.chestplateChain.name", "quantium suit core");
ModPE.langEdit("item.leggingsChain.name", "quantium leggings");
ModPE.langEdit("item.bootsChain.name", "quantium boots");

function updateQuantiumArmor() {
    if (!(1 > Entity.getHealth(getPlayerEnt()))) {
        var a = Level.getTime(),
            c = Entity.getHealth(getPlayerEnt()),
            d = -.6 > Entity.getVelY(getPlayerEnt());
        if (0 == a % 5) {
            var e = !0,
                f;
            for (f in qArmorData) qArmorData[f] = qArmorGetSlotState(f), 2 == qArmorData[f] && Player.setArmorSlot(f, 302 + parseInt(f), quantiumMaxDamage - 3), 1 != qArmorData[f] && (e = !1);
            qArmorHealthMode = 0;
            1 == qArmorData[3] && (qArmorHealthMode = 2);
            e && (qArmorHealthMode = 1);
            1 == qArmorData[2] || 1 == qArmorData[3] ? createQArmorButtons() : removeGUI_qArmor();
            qArmorUpdateSkin(qArmorData[1])
        }
        1 == qArmorData[1] || 3 == qArmorData[1] ? (createJetpackGUI(), e = Entity.getVelY(getPlayerEnt()), jetpackButtonPressed && (0 == a % 10 && 0 < Player.getArmorSlot(1) && Player.setArmorSlot(1, Player.getArmorSlot(1), Player.getArmorSlotDamage(1) + 1), setVelY(getPlayerEnt(), Math.min(e + .15, .6)))) : dismissJetpackGUI();
        if (0 < qArmorRTime && 1 == qArmorData[2] && (qArmorRTime--, 0 == Level.getTime() % 2)) {
            var a = Entity.getVelX(getPlayerEnt()),
                e = Entity.getVelZ(getPlayerEnt()),
                g = Math.sqrt(a * a + e * e),
                a = a / g,
                e = e / g;.1 < g &&
                (setVelX(getPlayerEnt(), a), setVelZ(getPlayerEnt(), e))
        }
        if (0 == qArmorHealthMode && 20 >= c) {
            a = 0;
            for (f in qArmorData) 6 == qArmorData[f] && (a += .24);
            if (c < qArmorLastHealth)
                for (f in c = c * (1 - a) + a * qArmorLastHealth, qArmorData) 0 < Player.getArmorSlot(f) && Player.setArmorSlot(f, Player.getArmorSlot(f), Player.getArmorSlotDamage(f) + 1);
            qArmorLastHealth = parseInt(c)
        }
        1 == qArmorHealthMode || 2 == qArmorHealthMode && d ? c = 1E3 : 20 < c ? c = 0 < qArmorLastHealth ? qArmorLastHealth : 20 : 20 >= c && (qArmorLastHealth = parseInt(c));
        Entity.setHealth(getPlayerEnt(),
            c)
    }
}

function qArmorGetSlotState(a) {
    var c = Player.getArmorSlot(a);
    a = Player.getArmorSlotDamage(a);
    return 452 == c || 453 == c || 454 == c || 455 == c ? 398 < a ? 7 : 6 : 462 == c && 1999 > a ? 3 : 462 == c ? 4 : 463 == c ? 5 : 302 != c && 303 != c && 304 != c && 305 != c ? 0 : a >= quantiumMaxDamage - 3 ? 2 : 1
}

function qArmorUpdateSkin(a) {
    var c = "mob/char.png";
    if (3 == a || 4 == a) c = "mob/jetpack.png";
    5 == a && (c = "mob/batpack.png");
    a = 0;
    for (var d in qArmorData)
        if (6 == qArmorData[d] || 7 == qArmorData[d]) a += Math.pow(2, 3 - d);
    0 < a && (c = "mob/nano/nano_" + a + ".png");
    Entity.setMobSkin(getPlayerEnt(), c)
}

function resetQuantiumArmor() {
    qArmorData = [0, 0, 0, 0];
    qArmorHealthMode = 0;
    qArmorLathHealth = -1;
    qArmorRTime = 0
}

function qArmorJump() {
    if (1 == qArmorData[3]) {
        var a = Entity.getVelY(getPlayerEnt()); - .1 < a && -.04 > a && setVelY(getPlayerEnt(), 1.3)
    }
}

function qArmorRun() {
    qArmorRTime = 30
}
var bottleLastHealth = 1001,
    bottleLastCarried = 0,
    bottleMeadEffect = 0;

function updateHandBottle(a) {
    var c = Entity.getHealth(getPlayerEnt());
    1 * c - 1 > 1 * bottleLastHealth && 20 >= c && (473 == bottleLastCarried || 474 == bottleLastCarried) && (474 == bottleLastCarried && (bottleMeadEffect = 600), addItemInventory(475, 1, 0));
    0 < bottleMeadEffect && (bottleMeadEffect--, ProvideMeadEffect());
    bottleLastCarried = a;
    bottleLastHealth = c
}
var meadEffectYawDir = 1,
    meadEffectPitchDir = 1;

function ProvideMeadEffect() {.08 > Math.random() && (meadEffectYawDir = 2 * parseInt(2 * Math.random()) - 1);.08 > Math.random() && (meadEffectPitchDir = 2 * parseInt(2 * Math.random()) - 1);
    if (0 == Level.getTime() % 60) {
        var a = Entity.getHealth(getPlayerEnt());
        20 > a && Entity.setHealth(getPlayerEnt(), a + 1)
    }
    a = getPlayerEnt();
    Entity.setRot(a, Entity.getYaw(a) + meadEffectYawDir, Entity.getPitch(a) + meadEffectPitchDir)
}

function batteryItemClick(a) {
    var c = Player.getCarriedItemData();
    c--;
    1E3 < c && (c = 1E3);
    0 > c && (c = 0);
    var d = Math.min(1E4 - 10 * c, 1E3),
        e = getMachineType(a);
    if (e && e.isUsingEnergy() && !e.isGenerator()) {
        var f = e.getMaxEnergyStored(),
            e = e.getEnergyStored(a);
        a.energyStored = Math.min(e + d, f);
        d = a.energyStored - e;
        ModPE.showTipMessage("energy transported: " + d);
        c += Math.floor(d / 10);
        Entity.setCarriedItem(getPlayerEnt(), 494, 1, c + 1);
        PlaySoundFile("Tools/BatteryUse.ogg")
    }
}

function EnergyCrystalClick(a) {
    var c = Player.getCarriedItemData();
    1E4 < c && (c = 1E4);
    0 > c && (c = 0);
    var d = Math.min(1E5 - 10 * c, 1E4),
        e = getMachineType(a);
    if (e && e.isUsingEnergy() && !e.isGenerator()) {
        var f = e.getMaxEnergyStored(),
            e = e.getEnergyStored(a);
        a.energyStored = Math.min(e + d, f);
        d = a.energyStored - e;
        ModPE.showTipMessage(ChatColor.RED + "energy transported: " + d);
        c += Math.floor(d / 10);
        Entity.setCarriedItem(getPlayerEnt(), 445, 1, c);
        PlaySoundFile("Tools/BatteryUse.ogg")
    }
}

function defineOre(a, c, d) {
    Block.defineBlock(a, c, d, 1, 1, 0);
    Block.setDestroyTime(a, 2);
    Block.setLightLevel(a, 0);
    Player.addItemCreativeInv(a, 1, 0)
}
defineOre(195, "uranium ore", "command_block");
defineOre(196, "iridium ore", "lever");
defineOre(197, "blended dust ore", "repeater_on");
defineOre(188, "copper ore", "trip_wire");
defineOre(189, "tin ore", "trip_wire_source");
ModPE.setItem(495, "repeater", 0, "uranium");
ModPE.setItem(493, "comparator", 0, "iridium chunk");
ModPE.setItem(480, "minecart_chest", 0, "copper ingot");
ModPE.setItem(481, "minecart_tnt", 0, "tin ingot");
ModPE.setItem(482, "minecart_hopper", 0, "dust copper");
ModPE.setItem(483, "minecart_furnace", 0, "dust tin");

function destroyBlock_ore(a, c, d) {
    var e = getCarriedItem(),
        f = getTile(a, c, d);
    if (195 == f || 196 == f || 197 == f || 188 == f || 189 == f) Level.destroyBlock(a, c, d), preventDefault();
    var g = [];
    if (509 == e || 278 == e || 257 == e || 274 == e) 188 == f && g.push([188, 0]), 189 == f && g.push([189, 0]);
    if (509 == e || 278 == e || 257 == e)
        if (195 == f && (g.push([495, 0]), .5 > Math.random() && g.push([501, 0])), 196 == f && (g.push([493, 0]), .5 > Math.random() && g.push([502, 0])), 197 == f) {
            for (var h = 0; h < 3 * Math.random(); h++) g.push([501, 0]);
            for (h = 0; h < 2 * Math.random(); h++) g.push([502, 0]);
            for (h = 0; h < 6 * Math.random(); h++) g.push([331, 0]);
            for (h = 1; h < Math.random() * Math.random() * 1.5; h++) g.push([495, 0]);
            for (h = 1; h < Math.random() * Math.random() * 3; h++) g.push([351, 4])
        }
    for (h in g) Level.dropItem(a + .5, c + .5, d + .5, 1, g[h][0], 1, g[h][1])
}

function tickWorldGenerator() {
    var a = Level.getTime() % 98;
    if (0 == a % 2) {
        var a = a / 2,
            c = Math.floor(getPlayerX() / 16 + a % 7) - 3,
            a = Math.floor(getPlayerZ() / 16 + a / 7) - 3;
        !checkChunkOreGenerated(c, a) && 60 > getPlayerY() && _generateChunkOre(c, a);
        checkChunkGenerated(c, a) || _generateChunk(c, a)
    }
}

function checkChunkOreGenerated(a, c) {
    return 4 == getTile(16 * a + 5, 0, 16 * c) || 0 == getTile(16 * a + 3, 0, 16 * c + 3)
}

function setChunkOreGenerated(a, c) {
    return setTile(16 * a + 5, 0, 16 * c, 4)
}

function checkChunkGenerated(a, c) {
    return 4 == getTile(16 * a + 6, 0, 16 * c) || 0 == getTile(16 * a + 3, 0, 16 * c + 3)
}

function setChunkGenerated(a, c) {
    return setTile(16 * a + 6, 0, 16 * c, 4)
}

function _generateChunkOre(a, c) {
    if (.35 > Math.random()) {
        var d = getRandChunkCoords(a, c, 4, 48);
        genTinyOreMinable(d[0], d[1], d[2], 196)
    }
    for (var e = 0; e < parseInt(2 * Math.random()); e++) d = getRandChunkCoords(a, c, 4, 20), genOreMinable(d[0], d[1], d[2], 197);
    for (e = 0; e < 13 * Math.random(); e++) d = getRandChunkCoords(a, c, 4, 56), genTinyOreMinable(d[0], d[1], d[2], 195);
    for (e = 0; e < 4 + 4 * Math.random(); e++) d = getRandChunkCoords(a, c, 8, 60), genOreMinable(d[0], d[1], d[2], 188);
    for (e = 0; e < 2 + 4 * Math.random(); e++) d = getRandChunkCoords(a, c, 8, 60), genOreMinable(d[0],
        d[1], d[2], 189);
    setChunkOreGenerated(a, c)
}

function _generateChunk(a, c) {
    FactAPI.InvokeCallback("genChunk", a, c);
    if (0 != getTile(16 * a + 3, 0, 16 * c + 3)) {
        if (1 > 96 * Math.random()) {
            var d = parseInt(16 * a + 2 + 12 * Math.random()),
                e = parseInt(16 * c + 2 + 12 * Math.random());
            genRubberTreeIntoWorld(d, e)
        }
        if (1 > 64 * Math.random()) {
            for (var d = 16 * a + 8, e = 16 * c + 8, f = 127; 60 < f && 0 == getTile(d, f, e);) f--;
            generateOillake(d, f, e)
        }
        if (1 > 64 * Math.random()) {
            d = parseInt(16 * a + 2 + 12 * Math.random());
            e = parseInt(16 * c + 2 + 12 * Math.random());
            for (f = 63; 88 > f;) {
                var g = getTile(d, f, e);
                if (0 == g || 31 == g || 32 == g) break;
                f++
            }
            66 <
                f && setTile(d, f, e, 236)
        }
        setChunkGenerated(a, c)
    }
}

function getRandChunkCoords(a, c, d, e) {
    return [Math.floor(16 * (a + Math.random())), Math.floor(d + (e - d) * Math.random()), Math.floor(16 * (c + Math.random()))]
}

function genOreMinable(a, c, d, e) {
    for (var f = -1; 2 > f; f++)
        for (var g = -1; 2 > g; g++)
            for (var h = -1; 2 > h; h++) {
                var k = Math.sqrt(f * f + g * g + h * h),
                    l = 1.5 - Math.random() / 2;
                k < l && setOreBlockTile(a + f, c + g, d + h, e)
            }
}

function genTinyOreMinable(a, c, d, e) {
    for (var f = 0; 2 > f; f++)
        for (var g = 0; 2 > g; g++)
            for (var h = 0; 2 > h; h++) {
                var k = Math.sqrt(f * f + g * g + h * h),
                    l = Math.random() * Math.random() * 1.5 + Math.random() / 2;
                k < l && setOreBlockTile(a + f, c + g, d + h, e)
            }
}

function setOreBlockTile(a, c, d, e, f) {
    var g = getTile(a, c, d);
    0 != g && 7 != g && 8 != g && 9 != g && setTile(a, c, d, e, f)
}
Block.defineBlock(192, "rubber tree wood", [
    ["log", 1],
    ["log", 1],
    ["log", 0],
    ["log", 0],
    ["log", 0],
    ["log", 0]
], 17, 1, 0);
Block.defineBlock(191, "rubber tree wood (active block)", [
    ["log", 1],
    ["log", 1],
    ["log", 0],
    ["log", 0],
    ["log", 0],
    ["log", 0]
], 17, 1, 0);
Block.defineBlock(194, "rubber wood with latex", [
    ["log", 1],
    ["log", 1],
    ["dragon_egg", 0],
    ["dragon_egg", 0],
    ["dragon_egg", 0],
    ["dragon_egg", 0]
], 17, 1, 0);
Block.defineBlock(193, "rubber tree leaves", [
    ["leaves", 3]
], 18, !1, 0);
Block.setLightOpacity(193, 0);
Block.setRenderLayer(193, 5);
Block.setShape(193, .001, .001, .001, .999, .999, .999);
Block.setColor(193, [7842321]);
Block.setColor(191, [11171601]);
Block.setColor(192, [11171601]);
Block.setColor(194, [11171601]);
Block.setDestroyTime(192, 2);
Block.setDestroyTime(194, 2);
Block.setDestroyTime(191, 2);
Block.setDestroyTime(193, 0);
ModPE.setItem(485, "gold_horse_armor", 0, "latex");
ModPE.setItem(486, "diamond_horse_armor", 0, "rubber tree sapling");
ModPE.setItem(488, "skull_skeleton", 0, "rubber");
Player.addItemCreativeInv(192, 1, 0);
Player.addItemCreativeInv(193, 1, 0);
Player.addItemCreativeInv(194, 1, 0);

function genRubberTree(a, c, d, e) {
    if (!e || checkRubberTreeZone(a, c, d)) {
        var f = 4 + parseInt(3 * Math.random()),
            g = 2 + parseInt(2 * Math.random());
        e = 1 + parseInt(2 * Math.random());
        for (var h = parseInt(2 * Math.random()), k = 0; k < f + g + h; k++) {
            var l = 192;
            k == e && (l = 194);
            0 == k && (l = 191);
            k < f ? setTile(a, c + k, d, l) : setTile(a, c + k, d, 193)
        }
        e = 3 + parseInt(2 * Math.random());
        f = f + g - e - 2;
        0 == f && (f++, e--);
        for (g = f; g < f + e; g++)
            for (h = -2; 2 >= h; h++)
                for (k = -2; 2 >= k; k++) {
                    var l = Math.sqrt(h * h + k * k),
                        m = 2.5 + Math.random();
                    g + 1 == f + e && --m;
                    l < m && 0 == getTile(h + a, c + g, k + d) && setTile(h +
                        a, c + g, k + d, 193)
                }
    }
}

function genRubberTreeIntoWorld(a, c) {
    for (var d = 60; 128 > d && 2 != getTile(a, d, c);) d++;
    120 < d || genRubberTree(a, d + 1, c, !0)
}

function checkRubberTreeZone(a, c, d) {
    for (var e = 2; 8 > e; e++)
        for (var f = -2; 3 > f; f++)
            for (var g = -2; 3 > g; g++) {
                var h = getTile(a + f, c + e, d + g);
                if (0 != h && 9 != h && 31 != h && 32 != h) return !1
            }
    return !0
}

function destroyBlock_rubberTree(a, c, d) {
    var e = getTile(a, c, d);
    if (192 == e || 194 == e || 191 == e) {
        preventDefault();
        Level.destroyBlock(a, c, d);
        if (1 > 3.2 * Math.random() || 194 == e)
            for (var f = 0; f < 2 * Math.random(); f++) {
                var g = Level.dropItem(a + .5, c + .5, d + .5, 0, 485, 1, 0);
                setVelY(g, 0)
            }
        wipeHeveaLeaves(a, c, d)
    }
    193 == e && (preventDefault(), Level.destroyBlock(a, c, d), 1 > 12 * Math.random() && (g = Level.dropItem(a + .5, c + .5, d + .5, 0, 486, 1, 0), setVelX(g, 0), setVelY(g, 0), setVelZ(g, 0)));
    236 == e && (preventDefault(), Level.destroyBlock(a, c, d))
}
ModPE.setItem(487, "skull_creeper", 0, "treetap", 1);
Item.setMaxDamage(487, 17);

function TreetapLatexUse(a, c, d, e) {
    var f = 0,
        g = 0;
    0 != e && 1 != e && 194 == getTile(a, c, d) && (2 == e && g--, 3 == e && g++, 4 == e && f--, 5 == e && f++, e = Level.dropItem(a + (f + 1) / 2, c + .5, d + (g + 1) / 2, 1, 485, parseInt(1 + 3 * Math.random()), 0), setVelX(e, f / 2), setVelZ(e, g / 2), setVelY(e, 0), f = 487, g = Player.getCarriedItemCount(), e = Player.getCarriedItemData(), e += parseInt(2 * Math.random() + 1), 17 < e && g--, 1 > g && (f = 0), Entity.setCarriedItem(getPlayerEnt(), f, g, e), setTile(a, c, d, 192), PlaySoundFile("Tools/Treetap.ogg"))
}

function wipeHeveaLeaves(a, c, d) {
    for (var e = -2; 3 > e; e++) {
        var f = getTile(a, e + c, d);
        if (192 != f && 194 != f)
            for (f = -2; 3 > f; f++)
                for (var g = -2; 3 > g; g++) {
                    var h = getTile(f + a, e + c, g + d);
                    192 != h && 193 != h && 194 != h || destroyBlock_rubberTree(f + a, e + c, g + d)
                }
    }
}

function ScrabBoxUse() {
    var a = Math.PI / 180,
        c = getPlayerEnt(),
        d = Entity.getYaw(c) * a,
        e = Entity.getPitch(c) * a * -1,
        a = -Math.sin(d) * Math.cos(e) * .3,
        d = Math.cos(d) * Math.cos(e) * .3,
        e = .3 * Math.sin(e),
        f = getRecyclerItem(),
        c = Level.dropItem(Entity.getX(c), Entity.getY(c), Entity.getZ(c), 0, f[0], 1, f[1]);
    setVelX(c, a);
    setVelY(c, e);
    setVelZ(c, d);
    c = 461;
    a = Player.getCarriedItemCount() - 1;
    1 > a && (c = 0);
    Entity.setCarriedItem(getPlayerEnt(), c, a, 0)
}
Block.defineBlock(178, "liquid constone", [
    ["clay", 0]
], 20, 1, 0);
Block.defineBlock(76, "constone", [
    ["clay", 0]
], 1, !0, 0);
ModPE.setItem(456, "book_writable", 0, "constone spray", 1);
ModPE.setItem(446, "book_written", 0, "compressed constone");
Item.setMaxDamage(456, 128);
Block.setColor(76, [11184810]);
Block.setDestroyTime(178, 0);
Block.setDestroyTime(76, 2);
Block.setExplosionResistance(178, 0);
Block.setExplosionResistance(76, 10);
Item.addShapedRecipe(178, 1, 0, ["   ", "ab ", "cd "], ["a", 331, 0, "b", 447, 0, "c", 12, 0, "d", 337, 0]);
Player.addItemCreativeInv(75, 64, 0);
Player.addItemCreativeInv(76, 64, 0);

function ConstoneItemUse(a, c, d, e, f) {
    if (456 == e) {
        var g = Player.getCarriedItemData(),
            h = 128 - g;
        if (1 > h) return;
        var k = BuildConstone(a, c + 1, d, Math.min(h, 16)),
            g = g + (Math.min(h, 16) - k);
        Entity.setCarriedItem(getPlayerEnt(), e, 1, g)
    }
    12 == e && 178 == f && (preventDefault(), DryConstone(a, c, d), a = Player.getCarriedItemCount() - 1, Entity.setCarriedItem(getPlayerEnt(), e, a, 0))
}

function isBlockSolid(a) {
    return !(0 == a || 31 == a || 32 == a || 8 == a || 9 == a || 10 == a || 11 == a || 32 == a)
}

function DryConstone(a, c, d) {
    for (var e = -2; 3 > e; e++)
        for (var f = -2; 3 > f; f++)
            for (var g = -2; 3 > g; g++) 2 >= Math.sqrt(e * e + f * f + g * g) && 178 == getTile(e + a, f + c, g + d) && setTile(e + a, f + c, g + d, 76)
}

function BuildConstone(a, c, d, e, f) {
    var g = getTile(a, c - 1, d),
        h = getTile(a, c, d);
    if (1 > e || isBlockSolid(h) || f && 178 != g && 4 != g && 76 != g) return e;
    if (!isBlockSolid(g)) return e = BuildConstone(a, c - 1, d, e);
    setTile(a, c, d, 178);
    e--;
    f = !1;
    if (178 == g || 4 == g || 76 == g) f = !0;
    e = BuildConstone(a - 1, c, d, e, f);
    e = BuildConstone(a + 1, c, d, e, f);
    e = BuildConstone(a, c, d - 1, e, f);
    return e = BuildConstone(a, c, d + 1, e, f)
}

function ConstoneDestroyBlock(a, c, d) {
    var e = getTile(a, c, d);
    if (178 == e || 76 == e) preventDefault(), Level.destroyBlock(a, c, d)
}
var possibleWireModelMob = -1;

function deathHook(a, c) {
    beeDeathHook(a, c)
}

function entityAddedHook(a) {
    eh_addedHook(a)
}

function entityRemovedHook(a) {
    eh_removedHook(a)
}
var EntityHashData = [];

function eh_clear() {
    EntityHashData = []
}

function eh_addedHook(a) {
    var c = Entity.getEntityTypeId(a);
    EntityHashData[c] || (EntityHashData[c] = []);
    EntityHashData[c].push(a);
    10 == Entity.getEntityTypeId(a) && 10 > Math.pow(getPlayerX() - Entity.getX(a), 2) + Math.pow(getPlayerY() - Entity.getY(a), 2) + Math.pow(getPlayerZ() - Entity.getZ(a), 2) && (possibleWireModelMob = a);
    60 > globalWorldTime && isMachine(getTile(parseIntCoord(Entity.getX(a)), parseIntCoord(Entity.getY(a)), parseIntCoord(Entity.getZ(a)))) && 11 == Entity.getEntityTypeId(a) && Entity.remove(a);
    Entity.setRot(a, 0,
        0)
}

function parseIntCoord(a) {
    0 > a && a != parseInt(a) && a--;
    return parseInt(a)
}

function eh_getRandomByType(a) {
    EntityHashData[a] || (EntityHashData[a] = []);
    a = EntityHashData[a];
    return a[parseInt(a.length * Math.random())]
}

function eh_removedHook(a) {
    var c = Entity.getEntityTypeId(a);
    EntityHashData[c] || (EntityHashData[c] = []);
    for (var d in EntityHashData[c])
        if (EntityHashData[c][d] == a) {
            EntityHashData[c].splice(d, 1);
            break
        }
}

function beeDeathHook(a, c) {
    for (var d in BeeEntityList) BeeEntityList[d].ent == c && (0 < Entity.getHealth(a) && Level.dropItem(Entity.getX(c), Entity.getY(c), Entity.getZ(c), 0, 470, 1, 0), Entity.remove(c))
}

function beeAttackHook(a, c) {
    for (var d in BeeEntityList) {
        var e = BeeEntityList[d];
        e.ent == c && (e.runAway = 400)
    }
}
var BeeEntityList = [];

function tickBeeEntities() {
    5E-4 > Math.random() && 2 > BeeEntityList.length && addBeeEntity(getPlayerX() - 30 + 60 * Math.random(), 64 + 20 * Math.random(), getPlayerZ() - 30 + 60 * Math.random());
    for (var a in BeeEntityList) {
        var c = BeeEntityList[a];
        c && (c.update(), 1 > Entity.getHealth(c.ent) && (BeeEntityList.splice(a, 1), a--))
    }
}

function addBeeEntity(a, c, d) {
    if (4 < BeeEntityList.length) return !1;
    a = Level.spawnMob(a, c, d, 37, "mob/bee.png");
    Entity.setRenderType(a, beeRenderer.renderType);
    BeeEntityList.push(new BeeEntity(a));
    Entity.setHealth(a, 5);
    return !0
}

function BeeEntity(a) {
    this.ent = a;
    this.target = null;
    this.runAway = this.yaw = this.vx = this.vy = this.vz = this.tcd = 0;
    this.update = function() {
        Entity.getX(this.ent);
        Entity.getY(this.ent);
        Entity.getZ(this.ent);
        1 > this.tcd ? this.findNewTarget() : this.tcd--;
        0 < this.runAway && (this.runAway--, this.away(.3));
        0 == Level.getTime() % 50 && this.moveTo(Math.floor(this.target.x) + Math.random(), Math.floor(this.target.y) + Math.random(), Math.floor(this.target.z) + Math.random(), .03);
        this.yaw = 180 * Math.atan2(-this.vx, this.vz) / Math.PI;
        setVelX(this.ent,
            this.vx);
        setVelY(this.ent, this.vy);
        setVelZ(this.ent, this.vz);
        Entity.setRot(this.ent, this.yaw, 0)
    };
    this.findNewTarget = function(a, d, e) {
        a = Math.floor(Entity.getX(this.ent));
        d = Math.floor(Entity.getY(this.ent));
        e = Math.floor(Entity.getZ(this.ent));
        a += 8 * Math.random() - 4;
        e += 8 * Math.random() - 4;
        d -= 2 * Math.random();
        for (var f = !1; 0 != getTile(a, d, e);) d++, f = !0;
        f && d++;
        this.target = {
            x: parseInt(a),
            y: parseInt(d),
            z: parseInt(e)
        };
        this.tcd = 100 + 50 * Math.random()
    };
    this.moveTo = function(a, d, e, f) {
        a -= Entity.getX(this.ent);
        d -= Entity.getY(this.ent);
        e -= Entity.getZ(this.ent);
        var g = Math.sqrt(a * a + d * d + e * e);
        this.vx = f / g * a;
        this.vy = f / g * d;
        this.vz = f / g * e
    };
    this.away = function(a) {
        var d = getPlayerX() - Entity.getX(this.ent),
            e = getPlayerY() - Entity.getY(this.ent),
            f = getPlayerZ() - Entity.getZ(this.ent),
            e = Math.sqrt(d * d + e * e + f * f);
        this.vx = -(a / e * d);
        this.vy = .05;
        this.vz = -(a / e * f)
    }
}

function convertWpdToModelHash(a) {
    if (!Options_FancyGrap) return Entity.remove(wpdModelMob);
    wpdModelHash = [];
    var c = function(a, c) {
            if (a == c || 215 == c && 199 == a || 216 == c && (217 == a || 199 == a)) return !0
        },
        d;
    for (d in a) {
        var e = d.split(","),
            f = a[d];
        if (215 == f) {
            var g = parseInt(e[0]),
                h = parseInt(e[1]),
                e = parseInt(e[2]),
                k = c(a[g - 1 + "," + h + "," + e], f),
                l = c(a[g + 1 + "," + h + "," + e], f),
                m = c(a[g + "," + (h + 1) + "," + e], f),
                n = c(a[g + "," + (h - 1) + "," + e], f),
                r = c(a[g + "," + h + "," + (e + 1)], f),
                f = c(a[g + "," + h + "," + (e - 1)], f),
                p = 5,
                q = 11,
                t = 5,
                u = 11,
                v = 5,
                w = 11;
            k && (p = 0);
            l && (q = 16);
            m && (t = 0);
            n && (u = 16);
            r && (v = 0);
            f && (w = 16);
            q -= p;
            u -= t;
            w -= v;
            p += 16 * g;
            t = 16 * h - t;
            v = 16 * e + 16 - v;
            6 < q && wpdModelHash.push([p, 16 * h - 5, 16 * (e + 1) - 5, q, 6, 6]);
            6 < u && wpdModelHash.push([16 * g + 5, t, 16 * (e + 1) - 5, 6, u, 6]);
            6 < w && wpdModelHash.push([16 * g + 5, 16 * h - 5, v, 6, 6, w])
        }
    }
    wpdRenderType = CreateWpdModel().renderType
}

function canWpdModelConnect(a, c) {}
var wpdModelHash = [],
    wpdModelOffset = {
        x: 0,
        y: 0,
        z: 0
    },
    wpdModelMob = -1,
    wpdRenderer = null;

function CreateWpdModel() {
    var a = wpdRenderer,
        c;
    a || (a = Renderer.createHumanoidRenderer(), c = a.getModel(), c.getPart("head").clear(), c.getPart("body").clear(), c.getPart("rightArm").clear(), c.getPart("leftArm").clear(), c.getPart("rightLeg").clear(), c.getPart("leftLeg").clear(), wpdRenderer = a);
    c = a.getModel();
    c.getPart("body").clear();
    c = c.getPart("body");
    var d = wpdModelOffset,
        e;
    for (e in wpdModelHash) b = wpdModelHash[e], c.addBox(b[0] + 16 * d.x, -b[1] + 16 * d.y + 8, -b[2] + 16 * d.z, b[3], b[4], b[5]);
    return a
}
var possibleWireMobPos = {
        x: 0,
        y: 0,
        z: 0
    },
    wpdRenderType = 1;

function wpdModelTick() {
    possibleWireModelMob != wpdModelMob && Entity.remove(possibleWireModelMob);
    var a = Entity.getX(wpdModelMob),
        c = Entity.getY(wpdModelMob),
        d = Entity.getZ(wpdModelMob),
        e = getPlayerX(),
        f = getPlayerY() + .38,
        g = getPlayerZ(),
        a = Math.sqrt((e - a) * (e - a) + (f - c) * (f - c) + (g - d) * (g - d));
    Entity.remove(wpdModelMob);
    Options_FancyGrap && (1.5 < a || c < f - .1 ? (a = e, c = f, d = g, 0 == getTile(parseIntCoord(a), c + .7, parseIntCoord(d)) ? (wpdModelOffset = {
        x: -a,
        y: c,
        z: d
    }, wpdRenderType = CreateWpdModel().renderType) : (a = -wpdModelOffset.x, c = wpdModelOffset.y,
        d = wpdModelOffset.z)) : (a = -wpdModelOffset.x, c = wpdModelOffset.y, d = wpdModelOffset.z), wpdModelMob = Level.spawnMob(a, c, d, 10, "mob/wire.png"), possibleWireMobPos = {
        x: a,
        y: c,
        z: d
    }, setVelX(wpdModelMob, 0), setVelY(wpdModelMob, 0), setVelZ(wpdModelMob, 0), Entity.setRot(wpdModelMob, 0, 0), Entity.setCollisionSize(wpdModelMob, 0, 0), Entity.setRenderType(wpdModelMob, wpdRenderType))
}
var EntitiesForUpdate = [];

function addEntityForUpdate(a, c) {
    a.ent = c;
    a.remove = !1;
    EntitiesForUpdate.push(a)
}

function tickEntitiesForUpdate() {
    for (var a in EntitiesForUpdate) {
        var c = EntitiesForUpdate[a];
        c.update && c.update();
        c.remove && (EntitiesForUpdate.splice(a, 1), a--)
    }
}
ModPE.setItem(444, "ruby", 0, "mining laser", 1);
Item.setMaxDamage(444, 1E3);

function LaserShot(a, c, d) {
    var e = Math.PI / 180;
    a = getPlayerX();
    c = getPlayerY();
    d = getPlayerZ();
    var f = Entity.getYaw(getPlayerEnt()) * e,
        g = -Entity.getPitch(getPlayerEnt()) * e,
        e = -Math.sin(f) * Math.cos(g),
        h = Math.sin(g),
        g = Math.cos(f) * Math.cos(g),
        f = new LaserShotArrow(e, h, g);
    a = Level.spawnMob(a + 2 * e, c + 2 * h, d + 2 * g, 80);
    addEntityForUpdate(f, a);
    PlaySoundFile("Tools/MiningLaser/MiningLaser.ogg")
}

function genLaserShotEl(a, c, d) {
    for (var e = -1; 2 > e; e++)
        for (var f = -1; 2 > f; f++)
            for (var g = -1; 2 > g; g++) {
                var h = getTile(a + e, c + f, d + g),
                    k = Level.getData(a + e, c + f, d + g);
                0 < h && isBlockBreakable(h, k) && (h = getBlockDestroyDrop(h, k), 4 < h[0] && Level.dropItem(a + e + .5, c + f + .5, d + g + .5, 0, h[0], h[1], h[2]), setTile(a + e, c + f, d + g, 0, 0))
            }
}

function LaserShotArrow(a, c, d) {
    this.vx = a;
    this.vy = c;
    this.vz = d;
    this.timer = 20;
    this.update = function() {
        (this.remove = 0 >= this.timer) && Entity.remove(this.ent);
        this.timer--;
        var a = Entity.getX(this.ent);
        0 > a && a--;
        var c = Entity.getY(this.ent),
            d = Entity.getZ(this.ent);
        0 > d && d--;
        genLaserShotEl(a, c, d);
        setVelX(this.ent, this.vx);
        setVelY(this.ent, this.vy);
        setVelZ(this.ent, this.vz);
        Level.addParticle(ParticleType.redstone, a, c, d, 0, 0, 0)
    }
}

function oilUseItem(a, c, d, e, f, g, h) {
    if (325 == e && 0 == Player.getCarriedItemData()) {
        0 == g && c--;
        1 == g && c++;
        2 == g && d--;
        3 == g && d++;
        4 == g && a--;
        5 == g && a++;
        f = getPlayerX();
        h = getPlayerY();
        for (var k = getPlayerZ(), l = a - f, m = c - h, n = d - k, r = Math.sqrt(l * l + m * m + n * n), l = l / r, m = m / r, n = n / r, p = 0; p < r; p += .1) {
            var q = parseInt(f + l * p),
                t = parseInt(h + m * p),
                u = parseInt(k + n * p);
            if (176 == getTile(q, t, u)) {
                getOilBucket(q, t, u);
                return
            }
        }
        getOilBucket(a, c, d)
    }
    464 == e && (0 == g && c--, 1 == g && c++, 2 == g && d--, 3 == g && d++, 4 == g && a--, 5 == g && a++, putOilBucket(a, c, d))
}

function oilDestroyBlock(a, c, d) {
    updateNearbyOil(a, c, d)
}

function oilTick() {
    0 == Level.getTime() % 4 && updateOil()
}

function getOilBucket(a, c, d) {
    176 == getTile(a, c, d) && (setTile(a, c, d, 0), updateNearbyOil(a, c, d), a = 325, c = Player.getCarriedItemCount(), c--, 1 > c ? (a = 464, c = 1) : addItemInventory(464, 1, 0), 0 == Level.getGameMode() && Entity.setCarriedItem(getPlayerEnt(), a, c, 0))
}

function putOilBucket(a, c, d) {
    setTile(a, c, d, 176);
    addOilUpdate(a, c, d, !0);
    0 == Level.getGameMode() && Entity.setCarriedItem(getPlayerEnt(), 325, 1, 0)
}

function defineOilBlocks() {
    try {
        var a = ["oil", 0];
        Block.defineBlock(176, "oil", [a], 8, !1, 4);
        Block.defineBlock(177, "oil#", [a], 9, !1, 4)
    } catch (c) {
        a = ["stained_clay", 14], Block.defineBlock(176, "oil", [a], 8, !1, 4), Block.defineBlock(177, "oil#", [a], 9, !1, 4), print("wrong textures used")
    }
    Block.setShape(176, 0, 0, 0, 0, 0, 0);
    Block.setShape(177, 0, 0, 0, 0, 0, 0);
    Block.setLightOpacity(176, 0);
    Block.setLightOpacity(177, 0);
    Block.setExplosionResistance(176, 6E3);
    Block.setExplosionResistance(177, 6E3)
}
ModPE.setItem(464, "magma_cream", 0, "oil bucket", 1);
Player.addItemCreativeInv(464, 1, 0);

function isOilBlock(a) {
    return 176 == a || 177 == a
}

function placeFlowingOil(a, c, d, e) {
    var f = Level.getData(a, c, d),
        g = getTile(a, c, d);
    if (!(177 == g && f < e) && canOilFlow(g)) return setTile(a, c, d, 177, e), !0
}

function canOilFlow(a) {
    return 0 == a || 31 == a || 32 == a || 177 == a || 51 == a || 30 == a || 175 == a || 37 == a || 38 == a || 39 == a || 40 == a
}
var oilBlocksUpdateCoords = [],
    oilAddedThisTick = 0;

function addOilUpdate(a, c, d, e) {
    key = a + "#" + c + "#" + d;
    oilAddedThisTick++;
    oilBlocksUpdateCoords[key] = e
}

function oilArrayCopy() {
    var a = [],
        c;
    for (c in oilBlocksUpdateCoords) a[c] = oilBlocksUpdateCoords[c];
    return a
}

function updateOilByKeyAndVal(a, c) {
    var d = a.split("#"),
        e = parseInt(d[0]),
        f = parseInt(d[1]),
        d = parseInt(d[2]);
    updateOilCoords(e, f, d, c)
}
var nextTickOilArrayUpdates = null;

function updateOil() {
    var a = oilArrayCopy();
    nextTickOilArrayUpdates ? a = nextTickOilArrayUpdates : (oilAddedThisTick = 0, oilBlocksUpdateCoords = []);
    var c = [],
        d = 0,
        e;
    for (e in a) 32 > d ? updateOilByKeyAndVal(e, a[e]) : c[e] = a[e], d++;
    nextTickOilArrayUpdates = 32 >= d ? null : c
}

function updateOilCoords(a, c, d, e) {
    var f = Level.getData(a, c, d) % 8;
    if (e) {
        var g = getTile(a, c, d);
        e = getTile(a, c - 1, d);
        if (canOilFlow(e) && (placeFlowingOil(a, c - 1, d, 0), addOilUpdate(a, c - 1, d, !0), 176 != g)) return;
        if ((176 != e || 176 == g) && 7 != f) {
            a = [
                [a - 1, d],
                [a, d - 1],
                [a + 1, d],
                [a, d + 1]
            ];
            for (var h in a) placeFlowingOil(a[h][0], c, a[h][1], f + 1) && addOilUpdate(a[h][0], c, a[h][1], !0)
        }
    } else if (e = getTile(a, c - 1, d), g = Level.getData(a, c - 1, d), setTile(a, c, d, 0), 177 == e && 0 == g && addOilUpdate(a, c - 1, d, !1), 7 != f)
        for (h in a = [
                [a - 1, d],
                [a, d - 1],
                [a + 1, d],
                [a,
                    d + 1
                ]
            ], a) d = getTile(a[h][0], c, a[h][1]), e = Level.getData(a[h][0], c, a[h][1]), 177 == d && e == f + 1 ? addOilUpdate(a[h][0], c, a[h][1], !1) : 177 == d && e <= f + 1 ? addOilUpdate(a[h][0], c, a[h][1], isOilHasSource(a[h][0], c, a[h][1])) : 176 == d && addOilUpdate(a[h][0], c, a[h][1], !0)
}
var GUIName = "factorization";

function canBreakBlocks() {
    return 0 == oilAddedThisTick
}

function updateOilBlock(a, c, d) {
    isOilBlock(getTile(a, c, d)) && addOilUpdate(a, c, d, isOilHasSource(a, c, d))
}

function addGUIString() {}
addGUIString = clientMessage;

function updateNearbyOil(a, c, d) {
    updateOilBlock(a, c, d + 1);
    updateOilBlock(a, c, d - 1);
    updateOilBlock(a + 1, c, d);
    updateOilBlock(a - 1, c, d);
    updateOilBlock(a, c + 1, d);
    updateOilBlock(a, c - 1, d)
}

function isOilHasSource(a, c, d, e, f) {
    e || (e = []);
    f || (f = 8);
    var g = a + "#" + c + "#" + d;
    if (e[g]) return !1;
    e[g] = !0;
    var h = getTile(a, c, d),
        g = Level.getData(a, c, d);
    if (!isOilBlock(h)) return !1;
    if (176 == h) return !0;
    if (g >= f) return !1;
    if (0 == g) return isOilHasSource(a, c + 1, d, e);
    a = [
        [a - 1, d],
        [a, d - 1],
        [a + 1, d],
        [a, d + 1]
    ];
    for (var k in a)
        if (isOilHasSource(a[k][0], c, a[k][1], e, g)) return !0
}

function generateOillake(a, c, d) {
    a -= 8;
    for (d -= 8; 5 < c && !isSolid(getTile(a, c, d)); --c);
    if (4 >= c) return !1;
    c -= 4;
    var6 = Array(2048);
    var7 = randInt(4) + 4;
    for (var8 = var8 = 0; var8 < var7; ++var8)
        for (var9 = 6 * Math.random() + 3, var11 = 4 * Math.random() + 2, var13 = 6 * Math.random() + 3, var15 = Math.random() * (16 - var9 - 2) + 1 + var9 / 2, var17 = Math.random() * (8 - var11 - 4) + 2 + var11 / 2, var19 = Math.random() * (16 - var13 - 2) + 1 + var13 / 2, var21 = 1; 15 > var21; ++var21)
            for (var22 = 1; 15 > var22; ++var22)
                for (var23 = 1; 7 > var23; ++var23) var24 = (var21 - var15) / (var9 / 2), var26 = (var23 - var17) /
                    (var11 / 2), var28 = (var22 - var19) / (var13 / 2), var30 = var24 * var24 + var26 * var26 + var28 * var28, 1 > var30 && (var6[8 * (16 * var21 + var22) + var23] = !0);
    var32 = var10 = 0;
    var33 = !1;
    for (var8 = 0; 16 > var8; ++var8)
        for (var32 = 0; 16 > var32; ++var32)
            for (var10 = 0; 8 > var10; ++var10)
                if (var33 = !var6[8 * (16 * var8 + var32) + var10] && (15 > var8 && var6[8 * (16 * (var8 + 1) + var32) + var10] || 0 < var8 && var6[8 * (16 * (var8 - 1) + var32) + var10] || 15 > var32 && var6[8 * (16 * var8 + var32 + 1) + var10] || 0 < var32 && var6[8 * (16 * var8 + (var32 - 1)) + var10] || 7 > var10 && var6[8 * (16 * var8 + var32) + var10 + 1] || 0 < var10 && var6[8 *
                        (16 * var8 + var32) + (var10 - 1)]))
                    if (var12 = getTile(a + var8, c + var10, d + var32), 4 <= var10 && (9 == var12 || 8 == var12 || 10 == var12 || 11 == var12) || 4 > var10 && !isSolid(var12)) return !1;
    for (var8 = 0; 16 > var8; ++var8)
        for (var32 = 0; 16 > var32; ++var32)
            for (var10 = 0; 8 > var10; ++var10) var6[8 * (16 * var8 + var32) + var10] && (idset = 0, 4 > var10 && (idset = 176), setTile(a + var8, c + var10, d + var32, idset));
    for (var8 = 0; 16 > var8; ++var8)
        for (var32 = 0; 16 > var32; ++var32)
            for (var10 = 4; 8 > var10; ++var10) var6[8 * (16 * var8 + var32) + var10] && 3 == getTile(a + var8, c + var10 - 1, d + var32) && setTile(a +
                var8, c + var10 - 1, d + var32, 2);
    for (var e = 0; e < randInt(3) + 5; e++) canOilFlow(getTile(a + 8, c + e, d + 8)) && (setTile(a + 8, c + e + 4, d + 8, 176), addOilUpdate(a + 8, c + e + 4, d + 8, !0));
    return !0
}

function isSolid(a) {
    return 1 == a || 2 == a || 3 == a || 8 == a || 9 == a || 12 == a || 13 == a || 82 == a || 24 == a || 14 == a || 15 == a || 16 == a || 56 == a || 73 == a || 74 == a || 21 == a
}

function randInt(a) {
    return Math.floor(Math.random() * a)
}
var GUIString = "";

function LoadGUIStrings() {
    GUIString = GUIName + " by " + GUIString;
    addGUIString(GUIString)
}
var isGuiDisabled = DataSaver.ReadBool("f#ge*");

function procCmd(a) {
    a.split(" ");
    "guioff" == a && (isGuiDisabled = !0, clientMessage("gui disabled"), DataSaver.Save("f#ge*", isGuiDisabled));
    "guion" == a && (isGuiDisabled = !1, clientMessage("gui enabled"), DataSaver.Save("f#ge*", isGuiDisabled));
    "particles all" == a && (ParticlesDisabled = !1, Level.addParticle = Level.addParticleSrc, DataSaver.Save("no#particles", !1), clientMessage("particles enabled"));
    "particles none" == a && (ParticlesDisabled = !0, Level.addParticle = function() {}, DataSaver.Save("no#particles", !0), clientMessage("particles disabled"))
}

function tickWrenchInfo() {
    try {
        var a = Player.getPointedBlockX(),
            c = Player.getPointedBlockY(),
            d = Player.getPointedBlockZ(),
            e = getMachine(a, c, d),
            f;
        e ? f = getMachineType(e) : machineActiveButtonId = -1;
        e && machineActiveButtonId != e.uniqueID && updateMachineActiveButton(e);
        a = "";
        f && f.isUsingEnergy() && (a += parseInt(f.getEnergyStored(e)) + "/" + f.getMaxEnergyStored() + "\n");
        f && (a += f.getMachineName() + "\n" + f.getInfo(e));
        setInfoText(a)
    } catch (g) {
        ModPE.showTipMessage(ChatColor.RED + "no wrench gui. update blocklauncher." + g)
    }
}

function leaveGame_gui() {
    removeGUI_info();
    removeGUI_qArmor();
    dismissJetpackGUI()
}

function newLevel_gui() {
    createStateView()
}
var stateWindow, stateText, machineActiveButton, machineActiveButtonId = -1;

function createStateView() {
    var a = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
    runAsGUI(function() {
        machineActiveButtonId = -1;
        var c = a.getWindowManager().getDefaultDisplay().getWidth() / 4;
        stateWindow = new android.widget.PopupWindow;
        var d = new android.widget.LinearLayout(a);
        stateText = new android.widget.TextView(a);
        stateText.setTextSize(14);
        stateText.setText("");
        stateText.setTextColor(android.graphics.Color.WHITE);
        setViewSize(stateText, c / 3 * 2, c / 3);
        d.addView(stateText);
        var e = new android.widget.ImageView(a);
        e.setImageBitmap(Images.buttonOff);
        setViewSize(e, c / 3, c / 3);
        e.setOnClickListener(new android.view.View.OnClickListener({
            onClick: function() {
                MachineActivationButtonTap()
            }
        }));
        d.addView(e);
        machineActiveButton = e;
        stateWindow.setContentView(d);
        stateWindow.setWidth(c);
        stateWindow.setHeight(c / 3);
        stateWindow.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        stateWindow.showAtLocation(a.getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0)
    })
}

function dip2px(a, c) {
    return Math.ceil(c * a.getResources().getDisplayMetrics().density)
}

function MachineActivationButtonTap() {
    var a = Player.getPointedBlockX(),
        c = Player.getPointedBlockY(),
        d = Player.getPointedBlockZ();
    if (a = getMachine(a, c, d)) getMachineType(a).canDeactivate() || (a.isActivated = !1), a.isActivated || (a.isActivated = !1), a.isActivated = a.isActivated ? !1 : !0, updateMachineActiveButton(a)
}

function updateMachineActiveButton(a) {
    machineActiveButtonId = a.uniqueID;
    runAsGUI(function() {
        a.isActivated ? machineActiveButton.setImageBitmap(Images.buttonOn) : machineActiveButton.setImageBitmap(Images.buttonOff)
    })
}

function removeGUI_info() {
    com.mojang.minecraftpe.MainActivity.currentMainActivity.get().runOnUiThread(new java.lang.Runnable({
        run: function() {
            stateWindow && (stateWindow.dismiss(), stateWindow = stateText = null)
        }
    }))
}

function removeGUI_qArmor() {
    com.mojang.minecraftpe.MainActivity.currentMainActivity.get().runOnUiThread(new java.lang.Runnable({
        run: function() {
            null != qArmorGUIWindow && (qArmorGUIWindow.dismiss(), qArmorGUIWindow = null)
        }
    }))
}

function setInfoText(a) {
    var c = a + "";
    isGuiDisabled || (0 == c.length && null != stateWindow ? removeGUI_info() : c && !stateWindow && createStateView(), com.mojang.minecraftpe.MainActivity.currentMainActivity.get().runOnUiThread(new java.lang.Runnable({
        run: function() {
            null != stateText && (stateText.setText(c), 0 < stateText.length ? stateWindow.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.GRAY)) : stateWindow.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0)))
        }
    })))
}

function setInfoColor(a) {}
var qArmorGUIWindow;

function createQArmorButtons() {
    if (!qArmorGUIWindow) {
        var a = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
        a.runOnUiThread(new java.lang.Runnable({
            run: function() {
                try {
                    var c = new android.widget.LinearLayout(a),
                        d = new android.widget.PopupWindow(a);
                    d.setContentView(c);
                    c.setOrientation(android.widget.LinearLayout.VERTICAL);
                    var e = a.getWindowManager().getDefaultDisplay().getWidth() / 10;
                    d.setWidth(e);
                    d.setHeight(2 * e);
                    d.showAtLocation(a.getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.BOTTOM,
                        0, 0);
                    qArmorGUIWindow = d;
                    var f = new android.widget.ImageView(a);
                    f.setImageBitmap(android.graphics.Bitmap.createScaledBitmap(android.graphics.Bitmap.createBitmap(Images.buttons, 20, 0, 20, 20), e, e, !1));
                    setViewSize(f, e, e);
                    f.setOnClickListener(new android.view.View.OnClickListener({
                        onClick: function() {
                            qArmorRun();
                            return !0
                        }
                    }));
                    c.addView(f);
                    var g = new android.widget.ImageView(a);
                    g.setImageBitmap(android.graphics.Bitmap.createScaledBitmap(android.graphics.Bitmap.createBitmap(Images.buttons, 0, 0, 20, 20), e, e, !1));
                    setViewSize(g,
                        e, e);
                    g.setOnClickListener(new android.view.View.OnClickListener({
                        onClick: function() {
                            qArmorJump();
                            return !0
                        }
                    }));
                    c.addView(g)
                } catch (h) {
                    clientMessage(h)
                }
            }
        }))
    }
}
var jetpackGUIWin = null,
    jetpackButtonPressed = !1;

function createJetpackGUI() {
    var a = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
    runAsGUI(function() {
        if (null == jetpackGUIWin) {
            var c = new android.widget.LinearLayout(a),
                d = new android.widget.PopupWindow(a);
            jetpackGUIWin = d;
            d.setContentView(c);
            c.setOrientation(android.widget.LinearLayout.VERTICAL);
            var e = a.getWindowManager().getDefaultDisplay().getWidth() / 10;
            d.setWidth(e);
            d.setHeight(e);
            var f = new android.widget.ImageView(a);
            f.setImageBitmap(android.graphics.Bitmap.createScaledBitmap(android.graphics.Bitmap.createBitmap(Images.buttons,
                40, 0, 20, 20), e, e, !1));
            setViewSize(f, e, e);
            f.setOnTouchListener(new android.view.View.OnTouchListener({
                onTouch: function(a, c) {
                    0 == c.action && (jetpackButtonPressed = !0);
                    1 == c.action && (jetpackButtonPressed = !1);
                    return !0
                }
            }));
            c.addView(f);
            d.showAtLocation(a.getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.BOTTOM, 0, 2 * e);
            jetpackGUIWin = d
        }
    })
}

function dismissJetpackGUI() {
    null != jetpackGUIWin && (com.mojang.minecraftpe.MainActivity.currentMainActivity.get(), runAsGUI(function() {
        null != jetpackGUIWin && (jetpackGUIWin.dismiss(), jetpackGUIWin = null)
    }))
}

function initContainerGUI() {
    LoadGUIItemData();
    tryDownloadGUIFiles();
    GUILoadImages()
}

function resetContainerGUI() {
    closeGUI()
}

function getMcContext() {
    return com.mojang.minecraftpe.MainActivity.currentMainActivity.get()
}

function LoadBitmap(a, c) {
    if (GUIDownloadError) return null;
    var d = new android.graphics.BitmapFactory.Options;
    d.inScaled = !1;
    d = android.graphics.BitmapFactory.decodeFile(android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/games/com.mojang/FactorizationGUI/" + a, d);
    return null != d || c ? d : null
}
var GUIDownloadError = !1,
    GUIDownloads = {
        "items_opaque.png": "http://i.imgur.com/ihndgzT.png",
        "gui4.png": "http://i.imgur.com/A8Cc72I.png?1",
        "gui5.png": "http://i.imgur.com/OKGVxMv.png?1",
        "buttons.png": "http://i.imgur.com/8eulGLH.png?1",
        "liquids.png": "http://i.imgur.com/uURi3b5.png",
        "xbutton.png": "http://i.imgur.com/hag1OLo.png",
        "selection.png": "http://i.imgur.com/b5iAzsJ.png",
        "energybar.png": "http://i.imgur.com/ZL3h4Gy.png",
        "progressbar.png": "http://i.imgur.com/oUF4e7v.png",
        "gui1.png": "http://i.imgur.com/CDiNJoT.png",
        "gui_blocks.png": "http://i.imgur.com/ImwcWjh.png",
        "gui3.png": "http://i.imgur.com/xW9TW3F.png",
        "gui2.png": "http://i.imgur.com/SCsOvJt.png",
        "inbutton.png": "http://i.imgur.com/StL15tH.png",
        "fire.png": "http://i.imgur.com/DOh0DrK.png",
        "buttons2.png": "http://i.imgur.com/ZlTHXYS.png",
        "361.png": "http://i.imgur.com/bnwME38.png",
        "37.png": "http://i.imgur.com/Se300oH.png",
        "gui6.png": "http://i.imgur.com/dBWISF9.png",
        "gui7.png": "http://i.imgur.com/4hka9t1.png",
        "slot.png": "http://i.imgur.com/1TTROhX.png"
    };

function tryDownloadGUIFiles() {
    try {
        GUIDownloadError = !1;
        var a = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/games/com.mojang/FactorizationGUI";
        (new java.io.File(a)).mkdir();
        if (null == LoadBitmap("slot.png")) {
            print("No gui files. Downloading...");
            for (var c in GUIDownloads) ModPE.downloadFile(c, GUIDownloads[c]);
            showUserAlertDialog("GUI download complete.\n\nфайлы GUI загружены")
        }
    } catch (d) {
        showUserAlertDialog("GUI downloading error. Try GUI Fixer app.\n\nОшибка при загрузке файлов GUI попробуйте приложение GUI Fixer",
            "error"), clientMessage(d), print("error in gui downloading"), GUIDownloadError = !0
    }
}

function GUILoadImages() {
    if (Images.inbutton) return print("loading gui...");
    Images.gui1 = LoadBitmap("gui1.png");
    Images.energybar = LoadBitmap("energybar.png");
    Images.progressbar = LoadBitmap("progressbar.png");
    Images.items = LoadBitmap("items_opaque.png");
    Images.selection = LoadBitmap("selection.png");
    Images.xbutton = LoadBitmap("xbutton.png");
    Images.gui2 = LoadBitmap("gui2.png");
    Images.gui3 = LoadBitmap("gui3.png");
    Images.guiblocks = LoadBitmap("gui_blocks.png");
    Images.inbutton = LoadBitmap("inbutton.png");
    Images.gui4 =
        LoadBitmap("gui4.png");
    Images.gui5 = LoadBitmap("gui5.png");
    Images.gui6 = LoadBitmap("gui6.png");
    Images.gui7 = LoadBitmap("gui7.png");
    Images.slot = LoadBitmap("slot.png");
    Images.liquids = LoadBitmap("liquids.png");
    Images.buttons = LoadBitmap("buttons.png");
    Images.fire = LoadBitmap("fire.png");
    Images.buttons2 = LoadBitmap("buttons2.png");
    Images.buttonOff = scaleGUIBitmap(android.graphics.Bitmap.createBitmap(Images.buttons2, 0, 0, 24, 24), -4);
    Images.buttonOn = scaleGUIBitmap(android.graphics.Bitmap.createBitmap(Images.buttons2,
        24, 0, 24, 24), -4)
}
var guiOpenState = 0,
    CurrentGUIWin = null,
    CurrentGUILayout = null,
    CurrentGUIView = null,
    CurrentGUIDrawable = null,
    GUIScale = -1,
    CurrentOpenedContainer = null,
    GUIXButton = null,
    GUI_inButton = null,
    GUISlots = [],
    GUIEnergyBar = null,
    GUIProgressBar = null,
    GUILiquidBar = null,
    GUIFireBar = null,
    GUIFireBarBG = null,
    Images = {},
    ImageCache = {};

function openGUI(a) {
    guiOpenState = 1;
    var c = getMcContext(),
        d = c.getWindowManager().getDefaultDisplay().getWidth(),
        e = c.getWindowManager().getDefaultDisplay().getHeight() / 1.6,
        f = 2 * e,
        g = (d - f) / 2;
    GUIScale = f / 256;
    runAsGUI(function() {
        CurrentGUIWin = new android.widget.PopupWindow(c);
        var d = c.getWindow().getDecorView();
        CurrentGUIWin.setWidth(parseInt(f));
        CurrentGUIWin.setHeight(parseInt(e));
        var k = new android.widget.RelativeLayout(c);
        CurrentGUILayout = k;
        var l = new android.widget.ImageView(c);
        k.addView(l);
        l = new android.graphics.drawable.BitmapDrawable(scaleGUIBitmap(guiBackgroundByType(a)));
        GUIXButton = new android.widget.Button(c);
        GUIXButton.setBackgroundDrawable(android.graphics.drawable.BitmapDrawable(scaleGUIBitmap(Images.xbutton, 1.5)));
        setViewSize(GUIXButton, parseInt(30 * GUIScale), parseInt(30 * GUIScale));
        CurrentGUILayout.addView(GUIXButton);
        setViewPos(GUIXButton, 226 * GUIScale, 0);
        GUIXButton.setOnClickListener(new android.view.View.OnClickListener({
            onClick: function() {
                closeGUI()
            }
        }));
        GUI_InButton = new android.widget.Button(c);
        GUI_InButton.setBackgroundDrawable(android.graphics.drawable.BitmapDrawable(scaleGUIBitmap(Images.inbutton,
            1.5)));
        setViewSize(GUI_InButton, parseInt(30 * GUIScale), parseInt(30 * GUIScale));
        CurrentGUILayout.addView(GUI_InButton);
        setViewPos(GUI_InButton, getInButtonX(a) * GUIScale, 88 * GUIScale);
        GUI_InButton.setOnClickListener(new android.view.View.OnClickListener({
            onClick: function() {
                putItemInSlot()
            }
        }));
        CurrentGUIWin.setContentView(k);
        CurrentGUIWin.setBackgroundDrawable(l);
        CurrentGUIWin.showAtLocation(d, android.view.Gravity.TOP | android.view.Gravity.LEFT, parseInt(g), 0)
    });
    BuildGUI(a)
}

function closeGUI() {
    UpdateAllIconList([], !0);
    runAsGUI(function() {
        CurrentGUIWin && (GUISlotSelected = -1, CurrentGUIWin.dismiss(), CurrentGUIDrawable = CurrentGUIView = CurrentGUILayout = CurrentGUIWin = null, GUIScale = -1, GUIXButton = CurrentOpenedContainer = null, GUISlots = [], GUIFireBarBG = GUIFireBar = GUILiquidBar = GUIProgressBar = GUIEnergyBar = null, guiOpenState = 0)
    })
}

function SetEnergyBarLevel(a) {
    runAsGUI(function() {
        if (CurrentGUILayout) {
            var c = getMcContext();
            0 > a && (a = 0);
            1 < a && (a = 1);
            a != a && (a = 0);
            GUIEnergyBar || (GUIEnergyBar = new android.widget.ImageView(c), CurrentGUILayout.addView(GUIEnergyBar));
            var c = 7 * GUIScale,
                d = parseInt(120 - parseInt(112 * a)) * GUIScale;
            setViewPos(GUIEnergyBar, c, d);
            1 <= 112 * a ? (c = android.graphics.Bitmap.createBitmap(Images.energybar, 0, 112 - parseInt(112 * a), 20, parseInt(112 * a)), GUIEnergyBar.setImageBitmap(scaleGUIBitmap(c))) : GUIEnergyBar.setImageBitmap(null)
        }
    })
}

function SetProgressBarLevel(a) {
    runAsGUI(function() {
        if (CurrentGUILayout) {
            0 > a && (a = 0);
            1 < a && (a = 1);
            a != a && (a = 0);
            var c = getMcContext();
            GUIProgressBar || (GUIProgressBar = new android.widget.ImageView(c), CurrentGUILayout.addView(GUIProgressBar));
            c = getGUIProgressBarX(CurrentOpenedContainer.id) * GUIScale;
            setViewPos(GUIProgressBar, c, 51 * GUIScale);
            1 <= 45 * a ? (c = android.graphics.Bitmap.createBitmap(Images.progressbar, 0, 0, 45 * a, 26), GUIProgressBar.setImageBitmap(scaleGUIBitmap(c))) : GUIProgressBar.setImageBitmap(null)
        }
    })
}

function SetLiquidBarLevel(a, c) {
    runAsGUI(function() {
        if (CurrentGUILayout) {
            var d = getMcContext();
            GUILiquidBar || (GUILiquidBar = new android.widget.ImageView(d), CurrentGUILayout.addView(GUILiquidBar));
            0 > a && (a = 0);
            1 < a && (a = 1);
            a != a && (a = 0);
            var d = 105 * GUIScale,
                e = parseInt(120 - parseInt(112 * a)) * GUIScale,
                f = 32 * GUILiquidOffset(c);
            setViewPos(GUILiquidBar, d, e);
            1 <= 112 * a ? (d = android.graphics.Bitmap.createBitmap(Images.liquids, f, Math.max(0, 112 - parseInt(112 * a)), 32, parseInt(112 * a)), GUILiquidBar.setImageBitmap(scaleGUIBitmap(d))) :
                GUILiquidBar.setImageBitmap(null)
        }
    })
}

function SetFireBarLevel(a, c) {
    runAsGUI(function() {
        if (CurrentGUILayout) {
            var c = getMcContext();
            GUIFireBarBG || (GUIFireBarBG = new android.widget.ImageView(c), setViewSize(GUIFireBarBG, 32 * GUIScale, 32 * GUIScale), CurrentGUILayout.addView(GUIFireBarBG));
            GUIFireBar || (GUIFireBar = new android.widget.ImageView(c), CurrentGUILayout.addView(GUIFireBar));
            0 > a && (a = 0);
            1 < a && (a = 1);
            a != a && (a = 0);
            c = android.graphics.Bitmap.createBitmap(Images.fire, 0, 0, 32, 32);
            GUIFireBarBG.setBackgroundDrawable(android.graphics.drawable.BitmapDrawable(scaleGUIBitmap(c)));
            var c =
                70 * GUIScale,
                e = 48 * GUIScale,
                f = Math.floor(80 - 32 * a) * GUIScale;
            setViewPos(GUIFireBar, c, f);
            setViewPos(GUIFireBarBG, c, e);
            try {
                var g = android.graphics.Bitmap.createBitmap(Images.fire, 32, Math.floor(32 - 32 * a), 32, 32 * a);
                GUIFireBar.setImageBitmap(scaleGUIBitmap(g))
            } catch (h) {
                GUIFireBar.setImageBitmap(null)
            }
        }
    })
}

function GUILiquidOffset(a) {
    return 8 == a ? 0 : 1 == a ? 1 : 2 == a ? 2 : 3 == a ? 3 : 10 == a ? 4 : 4 == a ? 6 : 5 == a ? 8 : 6 == a ? 7 : 7 == a ? 5 : 0
}

function getInButtonX(a) {
    return 3 == a ? 182 : 5 == a || 6 == a ? 226 : 108
}

function getGUIProgressBarX(a) {
    return 4 == a ? 83 : 104
}
var AspectIconsDataList = [],
    GUIAspectIcons = [];

function UpdateAllIconList(a, c) {
    runAsGUI(function() {
        if (CurrentGUILayout) {
            for (var c in GUIAspectIcons) CurrentGUILayout.removeView(GUIAspectIcons[c]);
            GUIAspectIcons = [];
            AspectIconsDataList = [];
            var e = getMcContext();
            for (c in a) {
                var f = null;
                f = new android.widget.ImageView(e), f.setOnClickListener(getIconClicker(a[c].onclick)), CurrentGUILayout.addView(f);
                var g = getAspectIcon(a[c].id);
                setViewPos(f, (a[c].x - 10) * GUIScale, (a[c].y - 10) * GUIScale);
                f.setImageBitmap(g);
                GUIAspectIcons[c] = f;
                AspectIconsDataList[c] = a[c]
            }
        }
    })
}

function getIconClicker(a) {
    return new android.view.View.OnClickListener({
        onClick: function(c) {
            try {
                a && a()
            } catch (d) {
                clientMessage(d)
            }
        }
    })
}

function updateAspectIcon(a, c, d, e) {
    var f = AspectIconsDataList[a],
        g = GUIAspectIcons[a];
    if (!g) return !1;
    runAsGUI(function() {
        if (f.id != c) {
            var a = getAspectIcon(c);
            g.setImageBitmap(a)
        }
        setViewPos(g, (d - 10) * GUIScale, (e - 10) * GUIScale);
        f.id = c;
        f.x = d;
        f.y = e
    });
    return !0
}

function getAspectIcon(a) {
    a = getGUIItemIcon(a, 0);
    return a ? a = android.graphics.Bitmap.createScaledBitmap(a, 24 * GUIScale, 24 * GUIScale, !1) : null
}
var guiItemsRawData = "260:0,448:0,262:-1,271:-1,275:-1,258:-1,286:-1,279:-1,355:0,364:0,363:0,500:0,499:-1,0:0,352:0,449:0,340:0,456:0,446:0,301:-1,305:-1,309:-1,317:0,313:0,281:0,0:0,0:0,0:0,261:-1,297:0,472:0,336:0,325:0,325:1,325:8,325:10,354:0,391:0,0:0,0:0,457:0,440:0,0:0,299:-1,303:-1,307:-1,315:-1,311:-1,366:0,365:0,337:0,263:0,493:0,357:0,264:0,486:0,330:0,324:0,351:0,351:1,351:2,351:3,351:4,351:5,351:6,351:7,351:8,351:9,351:10,351:11,351:12,351:13,351:14,351:15,344:0,388:0,0:0,0:0,0:0,0:0,494:-1,497:0,451:0,288:0,462:-1,450:0,0:0,455:-1,454:-1,453:-1,452:-1,0:0,318:0,259:-1,470:0,469:0,348:0,485:0,266:0,468:0,289;0,298:-1,302:-1,306:-1,314:-1,310:-1,290:-1,291:-1,292:-1,294:-1,293:-1,477:0,0:0,265:0,484:0,498:-1,334:0,300:-1,304:-1,308:-1,316:-1,312:-1,464:-1,465:-1,445:-1,360:0,0:0,480:0,483:0,482:0,328:0,481:0,282:0,459:0,0:0,405:0,466:-1,467:-1,321:0,339:0,270:-1,274:-1,257:-1,285:-1,278:-1,320:0,319:0,392:0,393:0,0:0,474:0,473:0,475:0,0:0,400:0,406:0,0:0,503:0,504:-1,506:0,501:0,502:0,505:-1,508:0,507:0,509:-1,510:-1,511:-1,496:0,331:0,388:0,495:0,447:0,444:-1,441:0,362:0,361:0,295:0,458:0,359:-1,269:-1,273:-1,256:-1,284:-1,277:-1,323:0,487:0,488:0,489:0,471:-1,460:0,463:-1,332:0,383:10,383:11,383:12,383:13,383:14,383:15,383:16,383:32,383:33,383:34,383:35,383:36,383:37,383:38,383:39,476:0,461:0,280:0,287:0,353:0,268:-1,272:-1,267:-1,283:-1,276:-1,296:0,347:0,345:0",
    guiItemsData = {},
    guiBlockRawData = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,24,26,27,30,31,32,35,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,56,57,58,59,60,61,62,63,64,65,66,67,68,71,73,74,78,79,80,81,82,83,85,86,87,89,91,92,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,114,120,121,126,127,128,129,133,134,135,136,139,141,142,155,156,157,158,159,161,162,163,164,170,171,172,173,174,175,188,189,192,193,194,195,196,197,199,200,201,202,203,204,205,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,243,244,245,246,247,248,249,255,240",
    guiBlockData = [],
    guiItemDamageRaw = "278:1500 293:1500 276:1500 277:1500 279:1500 272:132 273:132 274:132 275:132 291:132 268:53 269:53 270:53 271:53 290:53 256:256 257:256 258:256 267:256 292:256 302:3000 303:3000 304:3000 305:3000 509:300 510:300 504:1024 505:4096 494:1000 499:2000 471:1000 462:2000 463:6000 452:400 453:400 454:400 455:400 456:128 444:1000 445:10000".split(" "),
    guiItemDamage = [];

function LoadGUIItemData() {
    guiItemsData = {};
    var a = guiItemsRawData.split(","),
        c;
    for (c in a) guiItemsData[a[c]] = c;
    guiItemDamage = [];
    for (c in guiItemDamageRaw) a = guiItemDamageRaw[c].split(":"), guiItemDamage[parseInt(a[0])] = parseInt(a[1]);
    guiBlockData = [];
    a = guiBlockRawData.split(",");
    for (c in a) guiBlockData[parseInt(a[c])] = parseInt(c);
    guiBlockData[178] = guiBlockData[82];
    FactAPI.InvokeCallback("GUILoad")
}

function getGUIItemIcon(a, c) {
    var d = a + ":" + c,
        e = a + ":-1",
        f = parseInt(a),
        g = -1;
    if (255 < a) {
        if ("undefined" != guiItemsData[d] + "" && (g = guiItemsData[d]), "undefined" != guiItemsData[e] + "" && (g = guiItemsData[e]), -1 == g) return null
    } else if (g = guiBlockData[f], guiBlockData[f] != g) return null;
    0 == a && (g = 254);
    if (255 < a || 0 == a) {
        d = g % 16 * 16;
        g = 16 * parseInt(g / 16);
        g = android.graphics.Bitmap.createBitmap(Images.items, d, g, 16, 16);
        if (0 < c && guiItemDamage[a])
            for (e = guiItemDamage[a], d = parseInt(16 - c / e * 16), e = parseInt(c / e * 255), f = 0; 16 > f; f++) {
                var h = android.graphics.Color.BLACK;
                f < d && (h = android.graphics.Color.rgb(e, 255 - e, 0));
                g.setPixel(f, 14, h)
            }
        g = scaleGUIBitmap(g, 2)
    } else d = g % 17 * 68, g = 68 * parseInt(g / 17), g = android.graphics.Bitmap.createBitmap(Images.guiblocks, d, g, 68, 68), g = scaleGUIBitmap(g, 32 / 68);
    return g
}

function GUISlot(a, c, d) {
    this.x = a;
    this.y = c;
    this.id = this.count = this.data = 0;
    this.imgView = this.selView = this.textView = this.cachedIcon = null;
    this.isSelected = !1;
    this.selBmp = (this.isMini = d) ? scaleGUIBitmap(Images.selection, .625) : scaleGUIBitmap(Images.selection);
    this.createView = function() {
        var a = getMcContext(),
            c = 32;
        this.isMini && (c = 20);
        c = new android.widget.FrameLayout.LayoutParams(c * GUIScale, c * GUIScale);
        try {
            this.bgView = new android.widget.ImageView(a), this.bgView.setLayoutParams(c), CurrentGUILayout.addView(this.bgView),
                setViewPos(this.bgView, this.x * GUIScale, this.y * GUIScale), this.isMini && this.bgView.setImageBitmap(scaleGUIBitmap(Images.slot)), this.imgView = new android.widget.ImageView(a), this.imgView.setLayoutParams(c), CurrentGUILayout.addView(this.imgView), setViewPos(this.imgView, this.x * GUIScale, this.y * GUIScale), this.selView = new android.widget.ImageView(a), setViewPos(this.selView, (this.x - 2) * GUIScale, (this.y - 2) * GUIScale), CurrentGUILayout.addView(this.selView), this.tView = new android.widget.TextView(a), CurrentGUILayout.addView(this.tView),
                this.isMini ? setViewPos(this.tView, (this.x + 10) * GUIScale, (this.y + 10) * GUIScale) : setViewPos(this.tView, (this.x + 20) * GUIScale, (this.y + 20) * GUIScale)
        } catch (d) {
            clientMessage(d)
        }
    };
    this.updateSlot = function(a, c, d) {
        this.cachedIcon && a == this.id && d == this.data || (this.cachedIcon = getGUIItemIcon(a, d));
        var h = this;
        this.id = a;
        this.count = c;
        this.data = d;
        runAsGUI(function() {
            h.imgView || h.createView();
            h.imgView.setImageBitmap(h.cachedIcon);
            0 < c ? h.tView.setText(c + "") : h.tView.setText("");
            h.tView.setTextColor(android.graphics.Color.WHITE);
            h.tView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, 8 * GUIScale)
        })
    };
    this.setSelection = function(a) {
        this.isSelected = a;
        var c = this,
            d = 1;
        this.isMini && (d = 24 / 36);
        runAsGUI(function() {
            c.selView || c.createView();
            a ? c.selView.setImageBitmap(scaleGUIBitmap(Images.selection, d)) : c.selView.setImageBitmap(null)
        })
    }
}
var GUISlotSelected = -1;

function setSelectedGUISlot(a) {
    try {
        -1 != GUISlotSelected && GUISlots[GUISlotSelected].setSelection(!1), GUISlotSelected == a && null != CurrentOpenedContainer && CurrentOpenedContainer.transportToInv(a), GUISlotSelected = a, GUISlots[GUISlotSelected].setSelection(!0)
    } catch (c) {
        clientMessage(CharColor.RED + "[GUI Error]" + c)
    }
}

function generateSlotClickListener(a, c) {
    runAsGUI(function() {
        a.imgView || a.createView();
        a.imgView.setOnClickListener(new android.view.View.OnClickListener({
            onClick: function(a) {
                setSelectedGUISlot(c)
            }
        }))
    })
}

function addSlotToCurrentGUI(a, c, d) {
    a = new GUISlot(a, c, d);
    generateSlotClickListener(a, GUISlots.length);
    GUISlots.push(a)
}

function updateGUISlot(a, c, d, e) {
    try {
        GUISlots[a].updateSlot(c, d, e)
    } catch (f) {}
}
var GUIBuildData = 0;

function BuildGUI(a) {
    0 == a && (addSlotToCurrentGUI(64, 48), addSlotToCurrentGUI(164, 48));
    1 == a && addSlotToCurrentGUI(102, 48);
    2 == a && (addSlotToCurrentGUI(64, 48), addSlotToCurrentGUI(164, 48), addSlotToCurrentGUI(220, 48));
    3 == a && addSlotToCurrentGUI(180, 48);
    4 == a && (addSlotToCurrentGUI(29, 28), addSlotToCurrentGUI(29, 68), addSlotToCurrentGUI(159, 15), addSlotToCurrentGUI(194, 15), addSlotToCurrentGUI(143, 49), addSlotToCurrentGUI(177, 49), addSlotToCurrentGUI(211, 49), addSlotToCurrentGUI(159, 83), addSlotToCurrentGUI(194, 83));
    if (5 == a)
        for (var c = 0; 9 > c; c++) addSlotToCurrentGUI(16 + c % 3 * 34, 16 + 34 * parseInt(c / 3));
    if (6 == a) {
        a = GUIBuildData + 1;
        for (var c = 116 - 12 * GUIBuildData, d = 0; d < a; d++)
            for (var e = 0; 4 > e; e++) addSlotToCurrentGUI(c + 24 * d, 24 * e + 4, !0)
    }
    GUIBuildData = 0
}

function guiBackgroundByType(a) {
    return 0 == a ? Images.gui1 : 1 == a ? Images.gui2 : 2 == a ? Images.gui3 : 3 == a ? Images.gui4 : 4 == a ? Images.gui5 : 5 == a ? Images.gui6 : 6 == a ? Images.gui7 : null
}

function runAsGUI(a) {
    getMcContext().runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                a()
            } catch (c) {
                clientMessage(c)
            }
        }
    }))
}

function setViewSize(a, c, d) {
    c = new android.widget.FrameLayout.LayoutParams(c, d);
    a.setLayoutParams(c)
}

function setViewPos(a, c, d) {
    var e = a.getLayoutParams();
    null == e && (e = new android.widget.RelativeLayout.LayoutParams(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT));
    e.topMargin = d;
    e.leftMargin = c;
    a.setLayoutParams(e)
}

function scaleGUIBitmap(a, c) {
    c || (c = 1);
    return android.graphics.Bitmap.createScaledBitmap(a, a.getWidth() * GUIScale * c, a.getHeight() * GUIScale * c, !1)
}
ModPE.downloadFile = function(a, c) {
    var d = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/games/com.mojang/FactorizationGUI",
        d = new java.io.File(d + "/" + a);
    d.createNewFile();
    d = new java.io.FileOutputStream(d);
    android.net.http.AndroidHttpClient.newInstance("ModPE.downloadFile()").execute(new org.apache.http.client.methods.HttpGet(c)).getEntity().writeTo(d);
    d.close()
};

function putItemInSlot() {
    if (CurrentOpenedContainer && -1 != GUISlotSelected) {
        var a = getCarriedItem(),
            c = Player.getCarriedItemCount(),
            d = Player.getCarriedItemData(),
            c = CurrentOpenedContainer.putToSlot(GUISlotSelected, a, c, d);
        c || (d = a = 0);
        Entity.setCarriedItem(getPlayerEnt(), a, c, d)
    }
}

function Container(a) {
    this.slots = [];
    this.id = a;
    this.hasGUI = !1;
    a = 1;
    0 == this.id && (a = 2);
    2 == this.id && (a = 3);
    if (4 == this.id || 5 == this.id) a = 9;
    6 == this.id && (a = 32);
    for (var c = 0; c < a; c++) this.slots[c] = {
        id: 0,
        count: 0,
        data: 0
    };
    this.putToSlot = function(a, c, f, g) {
        a = this.slots[a];
        if ((a.id != c || a.data != g) && 0 != a.id) return f;
        var h = 64,
            k = a.count;
        if (473 == c || 474 == c || 475 == c || 325 == c || 471 == c || 472 == c || 468 == c || 464 == c || 465 == c || 466 == c || 467 == c) h = 1;
        a.count += f;
        a.id = c;
        a.data = g;
        a.count > h && (a.count = h);
        return f - (a.count - k)
    };
    this.onDestroy = function() {
        this.hasGUI &&
            closeGUI()
    };
    this.hasGUI = !1;
    this.open = function() {
        1 != guiOpenState && (closeGUI(), this.hasGUI = !0, openGUI(this.id), CurrentOpenedContainer = this)
    };
    this.updateGUI = function() {
        if (this.hasGUI)
            if (CurrentOpenedContainer != this) this.hasGUI = !1;
            else
                for (var a in this.slots) {
                    var c = this.slots[a];
                    updateGUISlot(a, c.id, c.count, c.data)
                }
    };
    this.setProgressBar = function(a) {
        !this.hasGUI || 0 != this.id && 2 != this.id && 4 != this.id || SetProgressBarLevel(a)
    };
    this.setEnergyBar = function(a) {
        this.hasGUI && (3 > this.id || 6 == this.id) && SetEnergyBarLevel(a)
    };
    this.setLiquidBar = function(a, c) {
        this.hasGUI && 3 == this.id && SetLiquidBarLevel(a, c)
    };
    this.setFireBar = function(a, c) {
        this.hasGUI && SetFireBarLevel(a, c)
    };
    this.setItemIcons = function(a, c) {
        this.hasGUI && 0 == Level.getTime() % 10 && UpdateAllIconList(a, !0)
    };
    this.transportToInv = function(a) {
        a = this.slots[a];
        addItemInventory(a.id, a.count, a.data);
        a.id = a.count = a.data = 0
    };
    this.getSlot = function(a) {
        return this.slots[a]
    };
    this.setSlot = function(a, c, f, g) {
        this.slots[a] = {
            id: c,
            count: f,
            data: g
        }
    };
    this.save = function(a) {
        for (var c in this.slots) {
            var f =
                this.slots[c];
            DataSaver.Save(a + c + "#id", f.id);
            DataSaver.Save(a + c + "#c", f.count);
            DataSaver.Save(a + c + "#d", f.data)
        }
    };
    this.read = function(a) {
        for (var c in this.slots) {
            var f = this.slots[c];
            f.id = DataSaver.ReadNumber(a + c + "#id");
            f.count = DataSaver.ReadNumber(a + c + "#c");
            f.data = DataSaver.ReadNumber(a + c + "#d")
        }
    };
    this.dropInv = function(a, c, f) {
        for (var g in this.slots) {
            var h = this.slots[g];
            h.id && h.count && Level.dropItem(a, c, f, 1, h.id, h.count, h.data)
        }
    }
}

function showUserAlertDialog(a, c) {
    a && (c || (c = "factorization"), runAsGUI(function() {
        var d = getMcContext();
        android.app.AlertDialog.Builder(d).setTitle(c).setMessage(a).show()
    }))
}
var languageIDs = {
    en: 0,
    rus: 1
};

function translate(a) {
    var c = languageIDs[langLocalisation];
    if (!c) return a;
    var d, e;
    for (e in LocalisationData) LocalisationData[e][0] == a && (d = LocalisationData[e]);
    return d ? (c = d[c]) ? c : a : a
}
var LocalisationData = [
    ["macerator", "дробитель"],
    ["recycler", "утилизатор"],
    ["crop harvester", "авто-фермер"],
    ["quarry", "карьер"],
    ["electric furnace", "электропечь"],
    ["beacon", "маяк"],
    ["drill", "бур"],
    ["solar pannel", "солнечная панель"],
    ["fuel generator", "топливный генератор"],
    ["nuclear reactor", "ядерный реактор"],
    ["windmill", "ветряк"],
    ["watermill", "водяная мельница"],
    ["geotermal generator", "геотермальный генератор"],
    ["chest transporter", "транспортер предметов"],
    ["bat-box", "бат-бокс"],
    ["teleporter", "телепортер"],
    ["pump", "насос"],
    ["barrel", "бочка"],
    ["bucket filler", "наполнитель ведер"],
    ["receiver", "приемник"],
    ["auto-milker", "автоматическая доилка"],
    ["mob slayer", "уничтожитель животных"],
    ["defender", "защита от монстров"],
    ["auto feeder", "кормушка"],
    ["block breaker", "разрушитель блоков"],
    ["liquid blender", "смешиватель жидкостей"],
    ["heater", "плавитель"],
    ["nuclear bomb", "ядерный заряд"],
    ["rubber tree harvester", "выращиватель гевеи"],
    ["wire", "провод"],
    ["pipe", "труба"],
    ["assembler", "авто-верстак"],
    ["mass fabricator", "генератор материи"],
    ["growth accelerator", "ускоритель роста"],
    ["wrench", "ключ"],
    ["connector", "соединитель"],
    ["dust iron", "железная пыль"],
    ["dust gold", "золотая пыль"]
];

function CustomMachineAPI(a) {
    this.parent = MachineBase;
    this.parent();
    this.id = a;
    this.energyUsing = this.generatorMode = !1;
    this.internalStorage = 1;
    this.tempValues = [];
    this.baseValues = [];
    this.updateMachine = function(a) {
        this.setAllValues(a);
        this.updateFunc && this.updateFunc(a)
    };
    this.setAllValues = function(a) {
        for (var d in this.baseValues) {
            var e = this.baseValues[d][0],
                f = this.baseValues[d][1];
            "undefined" == a[e] + "" && (a[e] = f)
        }
        for (d in this.tempValues) e = this.tempValues[d][0], f = this.tempValues[d][1], "undefined" == a[e] + "" &&
            (a[e] = f)
    };
    this.isUsingEnergy = function() {
        return this.energyUsing
    };
    this.getMaxEnergyStored = function() {
        return this.internalStorage
    };
    this.getEnergyOutput = function(a) {
        return this.outputFunc && (a = parseInt(this.outputFunc(a))) && 0 < a ? a : 0
    };
    this.getMachineName = function() {
        return this.machineName
    };
    this.isGenerator = function() {
        return this.generatorMode
    };
    this.save = function(a, d) {
        for (var e in this.baseValues) {
            var f = this.baseValues[e][0];
            DataSaver.Save(a + f, d[f])
        }
    };
    this.read = function(a, d) {
        for (var e in this.baseValues) {
            var f =
                this.baseValues[e][0];
            d[f] = DataSaver.ReadFloat(a + f)
        }
    };
    this.wrenchClick = function(a) {
        this.wrenchFunc && this.wrenchFunc(a)
    }
}
var FactAPI = {
    customMachines: [],
    defineMachine: function(a, c, d) {
        Block.defineBlock(a, c, d, 20, 0, 0);
        a = new CustomMachineAPI(a);
        this.customMachines.push(a);
        a.machineName = c;
        return a
    },
    setGenerator: function(a) {
        a.generatorMode = !0;
        a.energyUsing = !0
    },
    setEnergyStorage: function(a, c) {
        a.internalStorage = c;
        a.energyUsing = !0
    },
    addValue: function(a, c, d) {
        d || (d = 0);
        a.baseValues.push([c, d])
    },
    addTempValue: function(a, c, d) {
        d || (d = 0);
        a.tempValues.push([c, d])
    },
    setTickUpdate: function(a, c) {
        a.updateFunc = c
    },
    setTickOutput: function(a, c) {
        a.outputFunc =
            c;
        a.energyUsing = !0
    },
    setWrenchFunc: function(a, c) {
        a.wrenchFunc = c;
        a.energyUsing = !0
    },
    getChest: function(a, c, d) {
        return getChest(a, c, d)
    },
    addonList: [],
    registerAddon: function(a) {
        this.addonList.push(a)
    },
    addonInfo: function() {
        for (var a in this.addonList) clientMessage(ChatColor.YELLOW + this.addonList[a])
    },
    addItemToCharge: function(a, c) {
        batBox_itemsToCharge[a] = c
    },
    addItemToGui: function(a, c, d) {
        guiItemsData[c + 16 * d] = a
    },
    setItemMaxDamage: function(a, c) {
        guiItemDamage.push(a + ":" + c)
    },
    callbacks: {},
    addCallback: function(a, c) {
        var d =
            this.callbacks[a];
        d || (d = []);
        d.push(c);
        this.callbacks[a] = d
    },
    InvokeCallback: function(a, c, d, e, f, g, h, k, l) {
        if (a = this.callbacks[a])
            for (var m in a) a[m](c, d, e, f, g, h, k, l)
    },
    resetCustomMachineTypes: function(a) {
        for (var c in this.customMachines) this.customMachines[c].clear(), a.push(this.customMachines[c])
    }
};
