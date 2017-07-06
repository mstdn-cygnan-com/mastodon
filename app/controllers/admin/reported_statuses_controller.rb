# frozen_string_literal: true

module Admin
  class ReportedStatusesController < BaseController
    include Authorization

    before_action :set_report
    before_action :set_status, only: [:update, :destroy]

    def create
      @form = Form::StatusManager.new(form_status_manager_params)
      unless @form.save
        flash[:alert] = t('admin.statuses.failed_to_execute')
      end
      redirect_to admin_report_path(@report)
    end

    def update
      @status.update(status_params)
      redirect_to admin_report_path(@report)
    end

    def destroy
      authorize @status, :destroy?
      RemovalWorker.perform_async(@status.id)
      render json: @status
    end

    private

    def status_params
      params.require(:status).permit(:sensitive)
    end

    def form_status_manager_params
      params.require(:form_status_manager).permit(:action, status_ids: [])
    end

    def set_report
      @report = Report.find(params[:report_id])
    end

    def set_status
      @status = @report.statuses.find(params[:id])
    end
  end
end
