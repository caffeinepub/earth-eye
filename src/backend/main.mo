import Int "mo:core/Int";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Type definitions
  public type ClassificationResult = {
    itemType : Text;
    disposalMethod : Text;
    environmentalTip : Text;
    funFact : Text;
    points : Nat;
    timestamp : Time.Time;
  };

  public type UserProfilePublic = {
    principal : Principal;
    displayName : ?Text;
    points : Nat;
    scanCount : Nat;
    dailyChallengeProgress : Nat;
    lastScanTimestamp : Time.Time;
    scanHistory : [ClassificationResult];
  };

  public type CachedDay = {
    lastScanDay : Int;
    newDay : Int;
    progress : Nat;
  };

  // Persistent state
  let userProfiles = Map.empty<Principal, (UserProfilePublic, Time.Time)>();

  // Daily challenge settings
  let dailyChallengeTarget = 5;
  let dailyChallengePoints = 50;
  let basePoints = 10;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Waste classification logic
  func classifyWaste(item : Text) : ClassificationResult {
    let lowerItem = item.toLower();
    let currentTime = Time.now();

    switch (lowerItem) {
      case ("plastic") {
        {
          itemType = "Plastic";
          disposalMethod = "Recycle";
          environmentalTip = "Avoid single-use plastics whenever possible.";
          funFact = "It can take up to 1,000 years for plastic to decompose!";
          points = basePoints;
          timestamp = currentTime;
        };
      };
      case ("organic") {
        {
          itemType = "Organic";
          disposalMethod = "Compost";
          environmentalTip = "Composting reduces methane emissions from landfills.";
          funFact = "Composting can reduce household waste by up to 30%.";
          points = basePoints;
          timestamp = currentTime;
        };
      };
      case ("metal") {
        {
          itemType = "Metal";
          disposalMethod = "Recycle";
          environmentalTip = "Recycling one aluminum can saves enough energy to power a TV for 3 hours.";
          funFact = "Metal can be recycled indefinitely without losing quality.";
          points = basePoints;
          timestamp = currentTime;
        };
      };
      case ("paper") {
        {
          itemType = "Paper";
          disposalMethod = "Recycle";
          environmentalTip = "Recycling paper saves trees and reduces energy consumption.";
          funFact = "Every ton of recycled paper saves 17 trees.";
          points = basePoints;
          timestamp = currentTime;
        };
      };
      case ("glass") {
        {
          itemType = "Glass";
          disposalMethod = "Recycle";
          environmentalTip = "Glass is 100% recyclable and can be reused indefinitely.";
          funFact = "Recycling glass reduces water pollution by 50%.";
          points = basePoints;
          timestamp = currentTime;
        };
      };
      case ("e-waste") {
        {
          itemType = "E-Waste";
          disposalMethod = "Special Handling";
          environmentalTip = "Never dispose of electronics in regular trash.";
          funFact = "E-waste contains valuable metals that can be reused.";
          points = basePoints;
          timestamp = currentTime;
        };
      };
      case (_) {
        {
          itemType = "Unknown";
          disposalMethod = "Unknown";
          environmentalTip = "When in doubt, check local recycling guidelines.";
          funFact = "Proper waste classification helps protect the environment.";
          points = 0;
          timestamp = currentTime;
        };
      };
    };
  };

  func getCachedDay(lastScanTimestamp : Time.Time, newTime : Time.Time, progress : Nat) : CachedDay {
    let nanosecondsPerDay = 86400 * 1000000000;
    let newDay = if (newTime == 0) { 0 } else { newTime / nanosecondsPerDay };
    let lastScanDay = if (lastScanTimestamp == 0) {
      0;
    } else { lastScanTimestamp / nanosecondsPerDay };
    { lastScanDay; newDay; progress };
  };

  func getDailyChallengeProgress(
    cachedDay : CachedDay,
  ) : (dailyProgress : Nat, isNewDay : Bool, finalDay : Nat) {
    if (cachedDay.newDay > cachedDay.lastScanDay) {
      (cachedDay.lastScanDay.toNat(), true, 0);
    } else {
      (cachedDay.lastScanDay.toNat(), false, cachedDay.progress);
    };
  };

  func updateUserProfile(caller : Principal, classification : ClassificationResult) : UserProfilePublic {
    // Validate cached classification
    let existingProfile = userProfiles.get(caller);
    let currentTime = Time.now();
    let (newDailyChallengeDay, dailyChallengeReset, _oldProgress) = switch (existingProfile) {
      case (null) {
        getDailyChallengeProgress({ lastScanDay = 0; newDay = currentTime / (86400 * 1000000000); progress = 0 });
      };
      case (?profileTuple) {
        let (profile, timestamp) = profileTuple;
        getDailyChallengeProgress(getCachedDay(profile.lastScanTimestamp, currentTime, profile.dailyChallengeProgress));
      };
    };

    let currentChallengeProgress : Nat = if (dailyChallengeReset) { 0 } else {
      switch (existingProfile) {
        case (null) { 0 };
        case (?profileTuple) {
          let (profile, _timestamp) = profileTuple;
          profile.dailyChallengeProgress;
        };
      };
    };

    let newScanHistory = List.singleton<ClassificationResult>(classification);
    switch (existingProfile) {
      case (?profileTuple) {
        let (profile, _timestamp) = profileTuple;
        if (profile.scanHistory.size() > 0) {
          let history = profile.scanHistory.sliceToArray(0, Nat.min(9, profile.scanHistory.size()));
          let historyIter = history.values();
          var count = 1;
          for (entry in historyIter) {
            if (count <= 9) {
              newScanHistory.add(entry);
              count += 1;
            };
          };
        };
      };
      case (null) {};
    };

    var points = switch (existingProfile) {
      case (null) { classification.points };
      case (?profileTuple) {
        let (profile, _timestamp) = profileTuple;
        profile.points + classification.points;
      };
    };

    var scanCount = switch (existingProfile) {
      case (null) { 1 };
      case (?profileTuple) {
        let (profile, _timestamp) = profileTuple;
        profile.scanCount + 1;
      };
    };

    var dailyProgress = currentChallengeProgress + 1;
    if (dailyProgress >= 5) {
      points += dailyChallengePoints;
      dailyProgress := 0;
    };

    {
      principal = caller;
      displayName = switch (existingProfile) {
        case (null) { ?"Recycling Hero" };
        case (?profileTuple) {
          let (profile, _timestamp) = profileTuple;
          profile.displayName;
        };
      };
      points;
      scanCount;
      dailyChallengeProgress = dailyProgress;
      lastScanTimestamp = currentTime;
      scanHistory = newScanHistory.toArray();
    };
  };

  public query ({ caller }) func classifyItemOffline(item : Text) : async ClassificationResult {
    classifyWaste(item);
  };

  public shared ({ caller }) func scanItem(item : Text) : async ClassificationResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can scan items");
    };

    let classification = classifyWaste(item);
    if (classification.points > 0) {
      let updatedProfile = updateUserProfile(caller, classification);
      userProfiles.add(caller, (updatedProfile, Time.now()));
    };

    classification;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfilePublic {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profiles");
    };
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { ?profile.0 };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfilePublic) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, (profile, Time.now()));
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfilePublic {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?profile) { ?profile.0 };
    };
  };

  public query ({ caller }) func getLeaderboard() : async [(Text, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be signed in to view leaderboard");
    };

    let leaderboardList = List.empty<(Text, Nat)>();
    for ((principal, profileTuple) in userProfiles.entries()) {
      let (profile, _timestamp) = profileTuple;
      leaderboardList.add((
        switch (profile.displayName) {
          case (?name) { name };
          case (null) { principal.toText() };
        },
        profile.points,
      ));
    };

    let sortedLeaderboard = leaderboardList.values().toArray().sort(
      func(a, b) {
        if (a.1 > b.1) { #less } else if (a.1 < b.1) {
          #greater;
        } else { #equal };
      }
    );

    sortedLeaderboard.sliceToArray(0, Nat.min(10, sortedLeaderboard.size()));
  };

  public shared ({ caller }) func updateDisplayName(newName : Text) : async () {
    if (newName.size() == 0 or newName.size() > 30) {
      Runtime.trap("Invalid display name");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update display name");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile does not exist") };
      case (?profileTuple) {
        let (profile, _timestamp) = profileTuple;
        let updatedProfile = {
          principal = profile.principal;
          displayName = ?newName;
          points = profile.points;
          scanCount = profile.scanCount;
          dailyChallengeProgress = profile.dailyChallengeProgress;
          lastScanTimestamp = profile.lastScanTimestamp;
          scanHistory = profile.scanHistory;
        };
        userProfiles.add(caller, (updatedProfile, Time.now()));
      };
    };
  };
};
