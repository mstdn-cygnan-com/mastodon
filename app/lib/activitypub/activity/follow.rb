# frozen_string_literal: true

class ActivityPub::Activity::Follow < ActivityPub::Activity
  def perform
    target_account = account_from_uri(object_uri)

    return if target_account.nil? || !target_account.local? || delete_arrived_first?(@json['id'])

    follow_request = FollowRequest.create!(account: @account, target_account: target_account)

    if target_account.locked?
      NotifyService.new.call(target_account, follow_request)
    else
      AuthorizeFollowService.new.call(@account, target_account)
      NotifyService.new.call(target_account, ::Follow.find_by(account: @account, target_account: target_account))
    end
  end
end
