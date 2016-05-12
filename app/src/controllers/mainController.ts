/// <reference path="../_all.ts"/>

module ContactManagerApp{
    export class MainController {
        static $inject = ['userService', '$mdSidenav', '$mdToast', '$mdDialog', '$mdMedia'];
        constructor(
             private userService: IUserService,
             private $mdSidenav: angular.material.ISidenavService,
             private $mdToast: angular.material.IToastService,
             private $mdDialog: angular.material.IDialogService,
             private $mdMedia: angular.material.IMedia
        ){
            var self= this;

            this.userService
                .loadAllUsers()
                .then((users: User[]) => {
                  self.users = users;
                  self.selected = users[0];
                  self.userService.selectedUser = self.selected;

                  console.log(self.users);
                });
        }

        tabIndex: number = 0;
        searchText: string = "";
        users: User[] = [];
        selected: User = null;
        message: string = "Hello from out controller";

        toogleSideNav(): void {
            this.$mdSidenav('left').toggle();
        }
        selectUser (user: User) : void {
            this.selected = user;
            this.userService.selectedUser = user;

            var sidenav = this.$mdSidenav('left');
            if (sidenav.isOpen()) {
                sidenav.close();
            }

            this.tabIndex = 0;
        }

        addUser ($event) {
            var self = this;
            var userFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));

            this.$mdDialog.show({
                templateUrl: './dist/view/newUserDialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                controller: AddUserDialogController,
                controllerAs: 'ctrl',
                clickOutsideToClose: true,
                fullscreen: userFullScreen
            }).then((user: User)=>{
                self.openToast("User added");
            }, () => {
                self.openToast('You cancelled the dialog.');
            });
        }

        clearNotes($event) {
            var confirm = this.$mdDialog.confirm()
                .title('Are you sure you want to deleter all notes?')
                .textContent('All notes will be deleted, you cannot undo this action')
                .targetEvent($event)
                .ok('Yes')
                .cancel('No');
            var self = this;
            this.$mdDialog.show(confirm).then(() => {
                self.selected.notes = [];
                self.openToast('clear Notes');
            })
        }

        removeNote(note: Note): void {
            var foundIndex = this.selected.notes.indexOf(note);
            this.selected.notes.splice(foundIndex, 1);
            this.openToast("Notes has removed!");
        }

        openToast(message: string): void {
            this.$mdToast.show(
                this.$mdToast.simple()
                .textContent(message)
                .position('top right')
                .hideDelay(3000)
            )
        }
    }
}
