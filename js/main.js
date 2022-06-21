const button_icon = {
	play: `      <svg xmlns="http://www.w3.org/2000/svg" class="m-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"
	stroke-width="2">
	<path stroke-linecap="round" stroke-linejoin="round"
	  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
	<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
	pause: `<svg xmlns="http://www.w3.org/2000/svg" class="m-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"
				stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>`,
};

class coordinate_plane {
	constructor(w, h) {
		this.w = w;
		this.h = h;
		this.filled_squares = [];
		this.square_size = 20;
		this.linecolor = "#000";
		this.alive_squares = [];
		this.canvas = document.getElementById("canvas");
		this.canvas.width = w;
		this.canvas.height = h;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.fillStyle = "#000";
		this.fillStyle = this.linecolor;
		this.build();
	}
	drawaline(fromx, fromy, tox, toy) {
		this.ctx.strokeStyle = "black";
		this.ctx.beginPath();
		this.ctx.moveTo(fromx, fromy);
		this.ctx.lineTo(tox, toy);
		this.ctx.stroke();
	}
	drawahorizontalline(x) {
		this.drawaline(x, 0, x, this.h);
	}
	drawaverticalline(y) {
		this.drawaline(0, y, this.w, y);
	}
	fillasquare(x, y) {
		let start_x = x - (x % this.square_size) + 1;
		let start_y = y - (y % this.square_size) + 1;
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(
			start_x,
			start_y,
			this.square_size - 2,
			this.square_size - 2
		);
	}

	remove_a_square(x, y) {
		let start_x = x - (x % this.square_size) + 1;
		let start_y = y - (y % this.square_size) + 1;
		this.ctx.fillStyle = "#fff";
		this.ctx.fillRect(
			start_x,
			start_y,
			this.square_size - 2,
			this.square_size - 2
		);
	}

	isBlack(data) {
		return data[0] === 0 && data[1] === 0 && data[2] === 0 && data[3] === 255;
	}
	get_alive_neighbours(x, y) {
		let mid_x = x - (x % this.square_size) + this.square_size / 2;
		let mid_y = y - (y % this.square_size) + this.square_size / 2;

		const leftx = mid_x - this.square_size;
		const rightx = mid_x + this.square_size;
		const upy = mid_y - this.square_size;
		const downy = mid_y + this.square_size;

		let neighbours = {
			right: false,
			left: false,
			up: false,
			down: false,
			upright: false,
			downright: false,
			upleft: false,
			downleft: false,
		};
		if (leftx > 0)
			neighbours.left = this.isBlack(
				this.ctx.getImageData(leftx, mid_y, 1, 1).data
			);

		if (rightx > 0)
			neighbours.right = this.isBlack(
				this.ctx.getImageData(rightx, mid_y, 1, 1).data
			);
		if (upy > 0)
			neighbours.up = this.isBlack(
				this.ctx.getImageData(mid_x, upy, 1, 1).data
			);
		if (downy > 0)
			neighbours.down = this.isBlack(
				this.ctx.getImageData(mid_x, downy, 1, 1).data
			);

		if (leftx > 0 && upy > 0)
			neighbours.upleft = this.isBlack(
				this.ctx.getImageData(leftx, upy, 1, 1).data
			);
		if (leftx > 0 && downy > 0)
			neighbours.downleft = this.isBlack(
				this.ctx.getImageData(leftx, downy, 1, 1).data
			);
		if (rightx > 0 && upy > 0)
			neighbours.upright = this.isBlack(
				this.ctx.getImageData(rightx, upy, 1, 1).data
			);
		if (rightx > 0 && downy > 0)
			neighbours.downright = this.isBlack(
				this.ctx.getImageData(rightx, downy, 1, 1).data
			);

		console.log(this.ctx.getImageData(rightx, mid_y, 1, 1).data);
		let alive_count = 0;
		if (neighbours.right) alive_count += 1;
		if (neighbours.left) alive_count += 1;
		if (neighbours.up) alive_count += 1;
		if (neighbours.down) alive_count += 1;
		if (neighbours.upright) alive_count += 1;
		if (neighbours.downright) alive_count += 1;
		if (neighbours.upleft) alive_count += 1;
		if (neighbours.downleft) alive_count += 1;
		console.log(neighbours);
		return alive_count;
	}
	make_born_list() {
		let possible_born_list = []; //{x,y,alive neighbours}
		let count = 30;
		for (let index = 0; index < this.alive_squares.length; index++) {
			count--;
			if (count === 0) break;
			const element = this.alive_squares[index];
			const leftx = element.mid_x - this.square_size;
			const rightx = element.mid_x + this.square_size;
			const upy = element.mid_y - this.square_size;
			const downy = element.mid_y + this.square_size;

			if (leftx > 0) {
				if (
					!this.isBlack(this.ctx.getImageData(leftx, element.mid_y, 1, 1).data)
				) {
					let find_switch = false;
					for (let j = 0; j < possible_born_list.length; j++) {
						const e = possible_born_list[j];
						if (e.x == leftx && e.y == element.mid_y) {
							e.alive_neighbours += 1;
							find_switch = true;
							break;
						}
					}
					if (!find_switch) {
						possible_born_list.push({
							x: leftx,
							y: element.mid_y,
							alive_neighbours: 1,
						});
					}
				}
			}

			if (rightx > 0) {
				if (
					!this.isBlack(this.ctx.getImageData(rightx, element.mid_y, 1, 1).data)
				) {
					let find_switch = false;
					for (let j = 0; j < possible_born_list.length; j++) {
						const e = possible_born_list[j];
						if (e.x == rightx && e.y == element.mid_y) {
							e.alive_neighbours += 1;
							find_switch = true;
							break;
						}
					}
					if (!find_switch) {
						possible_born_list.push({
							x: rightx,
							y: element.mid_y,
							alive_neighbours: 1,
						});
					}
				}
			}
			if (upy > 0) {
				if (
					!this.isBlack(this.ctx.getImageData(element.mid_x, upy, 1, 1).data)
				) {
					let find_switch = false;
					for (let j = 0; j < possible_born_list.length; j++) {
						const e = possible_born_list[j];
						if (e.x == element.mid_x && e.y == upy) {
							e.alive_neighbours += 1;
							find_switch = true;
							break;
						}
					}
					if (!find_switch) {
						possible_born_list.push({
							x: element.mid_x,
							y: upy,
							alive_neighbours: 1,
						});
					}
				}
			}

			if (downy > 0) {
				if (
					!this.isBlack(this.ctx.getImageData(element.mid_x, downy, 1, 1).data)
				) {
					let find_switch = false;
					for (let j = 0; j < possible_born_list.length; j++) {
						const e = possible_born_list[j];
						if (e.x == element.mid_x && e.y == downy) {
							e.alive_neighbours += 1;
							find_switch = true;
							break;
						}
					}
					if (!find_switch) {
						possible_born_list.push({
							x: element.mid_x,
							y: downy,
							alive_neighbours: 1,
						});
					}
				}
			}
			if (leftx > 0 && upy > 0) {
				if (!this.isBlack(this.ctx.getImageData(leftx, upy, 1, 1).data)) {
					let find_switch = false;
					for (let j = 0; j < possible_born_list.length; j++) {
						const e = possible_born_list[j];
						if (e.x == leftx && e.y == upy) {
							e.alive_neighbours += 1;
							find_switch = true;
							break;
						}
					}
					if (!find_switch) {
						possible_born_list.push({ x: leftx, y: upy, alive_neighbours: 1 });
					}
				}
			}
			if (leftx > 0 && downy > 0) {
				if (!this.isBlack(this.ctx.getImageData(leftx, downy, 1, 1).data)) {
					let find_switch = false;
					for (let j = 0; j < possible_born_list.length; j++) {
						const e = possible_born_list[j];
						if (e.x == leftx && e.y == downy) {
							e.alive_neighbours += 1;
							find_switch = true;
							break;
						}
					}
					if (!find_switch) {
						possible_born_list.push({
							x: leftx,
							y: downy,
							alive_neighbours: 1,
						});
					}
				}
			}

			if (rightx > 0 && upy > 0) {
				if (!this.isBlack(this.ctx.getImageData(rightx, upy, 1, 1).data)) {
					let find_switch = false;
					for (let j = 0; j < possible_born_list.length; j++) {
						const e = possible_born_list[j];
						if (e.x == rightx && e.y == upy) {
							e.alive_neighbours += 1;
							find_switch = true;
							break;
						}
					}
					if (!find_switch) {
						possible_born_list.push({ x: rightx, y: upy, alive_neighbours: 1 });
					}
				}
			}
			if (rightx > 0 && downy > 0) {
				if (!this.isBlack(this.ctx.getImageData(rightx, downy, 1, 1).data)) {
					let find_switch = false;
					for (let j = 0; j < possible_born_list.length; j++) {
						const e = possible_born_list[j];
						if (e.x == rightx && e.y == downy) {
							e.alive_neighbours += 1;
							find_switch = true;
							break;
						}
					}
					if (!find_switch) {
						possible_born_list.push({
							x: rightx,
							y: downy,
							alive_neighbours: 1,
						});
					}
				}
			}
			console.log(possible_born_list);
		}

		return possible_born_list;
	}
	give_a_life(x, y) {
		let mid_x = x - (x % this.square_size) + this.square_size / 2;
		let mid_y = y - (y % this.square_size) + this.square_size / 2;
		this.fillasquare(x, y);
		this.alive_squares.push({ mid_x, mid_y });
	}

	take_a_life(x, y) {
		let mid_x = x - (x % this.square_size) + this.square_size / 2;
		let mid_y = y - (y % this.square_size) + this.square_size / 2;
		this.remove_a_square(x, y);
		this.alive_squares = this.alive_squares.filter(function (obj) {
			const res = obj.mid_x !== mid_x || obj.mid_y !== mid_y;
			console.log(res, obj.mid_x, "!= ", mid_x, obj.mid_y, "!= ", mid_y);
			console.log(obj.mid_x !== mid_x, obj.mid_y !== mid_y);
			return res;
		});
		console.log("alive squares", this.alive_squares);
	}
	give_life_to_all(born_list) {
		for (let index = 0; index < born_list.length; index++) {
			const sq = born_list[index];
			if (sq.alive_neighbours == 3) {
				this.give_a_life(sq.x, sq.y);
			}
		}
	}
	make_death_list() {
		let death_list = [];

		for (
			let alive_one = 0;
			alive_one < this.alive_squares.length;
			alive_one++
		) {
			const sq = this.alive_squares[alive_one];
			const alive_homies = this.get_alive_neighbours(sq.mid_x, sq.mid_y);
			console.log(sq.mid_x, sq.mid_y, alive_homies);
			if (alive_homies < 2) {
				death_list.push(sq);
			}
			if (alive_homies > 3) {
				death_list.push(sq);
			}
		}

		return death_list;
	}
	kill_all(death_list) {
		for (let index = 0; index < death_list.length; index++) {
			const sq = death_list[index];
			this.take_a_life(sq.mid_x, sq.mid_y);
		}
	}
	build() {
		console.log("building coordinate plane");
		for (let index = 0; index < this.w; index += this.square_size) {
			this.drawahorizontalline(index);
		}
		for (let index = 0; index < this.h; index += this.square_size) {
			this.drawaverticalline(index);
		}
	}
}

const buttons = {
	startbutton: document.getElementById("startpausebutton"),
	pausebutton: document.getElementById("pausebutton"),
	resetbutton: document.getElementById("resetbutton"),
};

class game {
	constructor() {
		this.gamestate = "";
		this.setgamestate = "stopped";
		this.speedrange = { min: 0, max: 2000, default: 1000 };
		this.gamespeed = this.speedrange.default;
		this.setgamespeed = 50;
		this.generation = 0;
		this.coordinate_plane = new coordinate_plane(
			window.innerWidth,
			window.innerHeight
		);
		this.coordinate_plane.build();
	}
	set setgamespeed(speed_by_percent) {
		if (this.gamestate == 'stopped') {
			if (speed_by_percent == 0) {
				return;
			} else if (speed_by_percent <= 100) {
				if (speed_by_percent < 50) {
					const times = (50 - speed_by_percent) * 2;
					this.gamespeed =
						this.speedrange.default +
						(this.speedrange.max - this.speedrange.default) * (times / 100);
				} else if (speed_by_percent > 50) {
					const divider = speed_by_percent - 50;
					this.gamespeed = 1000 / divider;
				}
			}
			if (speed_by_percent == 50) {
				this.gamespeed = 1000;
			}
			document.getElementById("speed").innerHTML = 2 - this.gamespeed / 1000;
			return
		} else {
			this.stop();
			if (speed_by_percent == 0) {
				return;
			} else if (speed_by_percent <= 100) {
				if (speed_by_percent < 50) {
					const times = (50 - speed_by_percent) * 2;
					this.gamespeed =
						this.speedrange.default +
						(this.speedrange.max - this.speedrange.default) * (times / 100);
				} else if (speed_by_percent > 50) {
					const divider = speed_by_percent - 50;
					this.gamespeed = 1000 / divider;
				}
			}

			if (speed_by_percent == 50) {
				this.gamespeed = 1000;
			}
			document.getElementById("speed").innerHTML = 2 - this.gamespeed / 1000;
			this.start();
		}

	}

	set setgamestate(state) {
		if (state == "running" || state == "stopped") {
			this.gamestate = state;
			document.getElementById("gamestate").innerHTML = this.gamestate;
		}
	}

	next() {
		const born_list = g.coordinate_plane.make_born_list();
		const death_list = g.coordinate_plane.make_death_list();
		this.generation += 1;
		document.getElementById("generation").innerHTML = this.generation;
		g.coordinate_plane.give_life_to_all(born_list);
		g.coordinate_plane.kill_all(death_list);
	}
	start() {
		console.log("game has been started");
		this.setgamestate = "running";
		buttons.startbutton.innerHTML = button_icon.pause;
		this.intervalID = setInterval(() => {
			this.next();
		}, this.gamespeed);
		return "start";
	}

	stop() {
		console.log("game has been stopped");
		this.setgamestate = "stopped";
		buttons.startbutton.innerHTML = button_icon.play;
		clearInterval(this.intervalID);

		return "stop";
	}
}

const g = new game();

const button_action = {
	startpause: () => {
		console.log("gamestate-->", g.gamestate);
		if (g.gamestate === "running") {
			g.stop();
		} else if (g.gamestate === "stopped") g.start();
		console.log("new gamestate-->", g.gamestate);
	},
	nextstate: () => {
		console.log("reset button clicked");
		g.next();
	},
};
var rangeInput = document.getElementById("speed-range");

rangeInput.addEventListener(
	"change",
	function () {
		console.log(rangeInput.value);
		g.setgamespeed = rangeInput.value;
	},
	false
);

function getCursorPosition(canvas, event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	g.coordinate_plane.give_a_life(x, y);
	console.log(g.coordinate_plane.get_alive_neighbours(x, y));
	console.log("x: " + x + " y: " + y);
}

const canvas = document.querySelector("canvas");
canvas.addEventListener("mousedown", function (e) {
	getCursorPosition(canvas, e);
});
