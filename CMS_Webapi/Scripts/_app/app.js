﻿/// <reference path="../angular.js"/>
app = angular.module("spa", ["ngResource", "ngRoute"]);

app.factory("articleService", function ($resource) {
    return $resource("/api/Articles/:id",
    { id: "@Id" },
    {
        update: { method: "PUT" }
    });
});

app.factory("categoryService", function ($resource) {
    return $resource("/api/Categories/:id",
    { id: "@Id" },
    {
        update: { method: "PUT" }
    });
});

app.factory("userService", function ($resource) {
    return $resource("/api/Users/:id",
    { id: "@Id" },
    {
        update: { method: "PUT" }
    });
});

app.run(function ($rootScope) {
    $rootScope.$on("changedCategories", function () {
        $rootScope.$broadcast("broadcastCats");
    });
});

app.controller("navController", function($scope, categoryService) {
    $scope.categories = categoryService.query();

    $scope.$on("broadcastCats", function () {
        $scope.categories = categoryService.query();
    });
});

app.controller("artsByCatController", function ($scope, categoryService) {
    $scope.category = categoryService.query();
});

app.controller("artsByAuthorController", function ($scope, articleService) {
    $scope.articles = articleService.query();
});

app.controller("allArtsController", function ($scope, articleService) {
    $scope.articles = articleService.query();
});

app.controller("articleController", function ($scope, articleService, categoryService, userService) {
    $scope.settings = {
        title: "Articles"
    };

    $scope.articles = articleService.query();
    $scope.categories = categoryService.query();
    $scope.users = userService.query();

    $scope.errors = [];

    $scope.article = {
        Id: "",
        Title: "",
        Content: "",
        Date: "",
        Reviewed: false,
        Approved: false,
        CategoryId: 0
    };

    $scope.saveArticle = function () {
        if ($scope.article.Id > 0) {
            articleService.update($scope.article, $scope.refreshArticles, $scope.errorMessage);
        } else {
            $scope.article.Id = 0;
            articleService.save($scope.article, $scope.refreshArticles, $scope.errorMessage);
        }
    }

    $scope.errorMessage = function (response) {
        var errors = [];
        for (var key in response.data.ModelState) {
            for (var i = 0; i < response.data.ModelState[key].length; i++) {
                errors.push(response.data.ModelState[key][i]);
            }
        }
        $scope.errors = errors;
    };

    $scope.refreshArticles = function () {
        $scope.articles = articleService.query();
        $("#modal-dialog").modal("hide");
    };

    $scope.deleteArticle = function (art) {
        articleService.delete(art, $scope.refreshArticles);
    };

    $scope.selectArticle = function (art) {
        $scope.article = art;
        $scope.showDialog("Edit Article");
    };

    $scope.clearArticle = function () {
        $scope.article = {
            Id: "",
            Title: "",
            Content: "",
            Date: "",
            Reviewed: false,
            Approved: false,
            CategoryId: 0
        };
    };

    $scope.deleteArticle = function (art) {
        articleService.delete(art, $scope.refreshArticles, $scope.errorMessage);
        $scope.clearArticle();
    }

    $scope.showAddArticleDialog = function () {
        $scope.clearArticle();
        $scope.showDialog("Add New Article");
    }

    $scope.showDialog = function (title) {
        $scope.errors = [];
        $scope.settings.title = title;
        $scope.categories = categoryService.query();
        $scope.users = userService.query();
        $("#modal-dialog").modal("show");
    }
});

app.controller("categoryController", function ($scope, categoryService) {

    $scope.settings = {
        title: "Categories"
    };

    $scope.errors = [];

    $scope.categories = categoryService.query();

    $scope.category = {
        Id: "",
        Name: "",
        Articles: ""
    };


    $scope.saveCategory = function () {
        if ($scope.category.Id > 0) {
            categoryService.update($scope.category, $scope.refreshCategories, $scope.errorMessage);
        } else {
            $scope.category.Id = 0;
            categoryService.save($scope.category, $scope.refreshCategories, $scope.errorMessage);
        }
    }

    $scope.deleteCategory = function (cat) {
        categoryService.delete(cat, $scope.refreshCategories, $scope.errorMessage);
    };

    $scope.errorMessage = function (response) {
        var errors = [];
        for (var key in response.data.ModelState) {
            for (var i = 0; i < response.data.ModelState[key].length; i++) {
                errors.push(response.data.ModelState[key][i]);
            }
        }
        $scope.errors = errors;
    };

    $scope.refreshCategories = function () {
            $scope.categories = categoryService.query();
            $("#modal-dialog").modal("hide");
    }

    $scope.selectCategory = function (cat) {
        $scope.category = cat;
        $scope.showDialog("Edit Category");
    }

    $scope.showAddCategoryDialog = function () {
        $scope.clearCategory();
        $scope.showDialog("Add New Category");
    };

    $scope.showDialog = function (title) {
        $scope.errors = [];
        $scope.settings.title = title;
        $("#modal-dialog").modal("show");
    }

    $scope.clearCategory = function () {
        $scope.category = {
            Id: "",
            Name: ""
        };
    }

    $scope.$watch("categories", function() {
        $scope.$emit("changedCategories");
    });
});

app.controller("userController", function ($scope, userService, articleService) {
    $scope.settings = {
        title: "Users"
    };

    $scope.articles = articleService.query();
    $scope.users = userService.query();

    $scope.errors = [];

    $scope.user = {
        Id: "",
        Username: "",
        Email: "",
        Articles: ""
    };

    $scope.saveUser = function () {
        if ($scope.user.Id > 0) {
            userService.update($scope.user, $scope.refreshUsers, $scope.errorMessage);
        } else {
            $scope.user.Id = 0;
            userService.save($scope.user, $scope.refreshUsers, $scope.errorMessage);
        }
    }

    $scope.errorMessage = function (response) {
        var errors = [];
        for (var key in response.data.ModelState) {
            for (var i = 0; i < response.data.ModelState[key].length; i++) {
                errors.push(response.data.ModelState[key][i]);
            }
        }
        $scope.errors = errors;
    };

    $scope.refreshUsers = function () {
        $scope.users = userService.query();
        $("#modal-dialog").modal("hide");
    };

    $scope.deleteUser = function (user) {
        userService.delete(user, $scope.refreshUsers);
    };

    $scope.selectUser = function (user) {
        $scope.user = user;
        $scope.showDialog("Edit User");
    };

    $scope.clearUser = function () {
        $scope.user = {
            Id: "",
            Username: "",
            Email: "",
            Articles: ""
        };
    };

    $scope.deleteUser = function (user) {
        userService.delete(user, $scope.refreshUsers, $scope.errorMessage);
        $scope.clearUser();
    }

    $scope.showAddUserDialog = function () {
        $scope.clearUser();
        $scope.showDialog("Add New User");
    }

    $scope.showDialog = function (title) {
        $scope.errors = [];
        $scope.settings.title = title;
        $scope.articles = articleService.query();
        $("#modal-dialog").modal("show");
    }
});

app.config(function ($routeProvider) {
    $routeProvider.when("/articles", {
        templateUrl: "/Views/Articles/Index.html",
        controller: "articleController"
    }).when("/allArticles", {
        templateUrl: "/Views/Articles/AllArticles.html",
        controller: "allArtsController"
    }).when("/articlesByAuthor/:id", {
        templateUrl: "/Views/Articles/ArticlesByAuthor.html",
        controller: "artsByAuthorController"
    }).when("/categories", {
        templateUrl: "/Views/Categories/Index.html",
        controller: "categoryController"
    }).when("/articlesByCategory/:id", {
        templateUrl: "/Views/Categories/ArticlesByCategory.html",
        controller: "artsByCatController"
    }).when("/users", {
        templateUrl: "/Views/Users/Index.html",
        controller: "userController"
    });
});